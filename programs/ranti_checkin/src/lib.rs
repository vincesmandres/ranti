use anchor_lang::prelude::*;

declare_id!("6L9fJY4qf2nB4V9YwVh3E2wQ5s7Y3K1mN8pR2tU4xZcQ");

#[program]
pub mod ranti_checkin {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, authority: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = authority;
        config.bump = ctx.bumps.config;
        emit!(ConfigInitialized {
            authority,
            config: config.key(),
        });
        Ok(())
    }

    pub fn check_in(
        ctx: Context<CheckIn>,
        ticket_ref: [u8; 32],
        event_ref: [u8; 32],
        checked_in_at: i64,
    ) -> Result<()> {
        require!(checked_in_at > 0, RantiError::InvalidTimestamp);

        let checkin = &mut ctx.accounts.checkin_record;
        checkin.user = ctx.accounts.user.key();
        checkin.ticket_ref = ticket_ref;
        checkin.event_ref = event_ref;
        checkin.checked_in_at = checked_in_at;
        checkin.bump = ctx.bumps.checkin_record;

        emit!(CheckInRecorded {
            user: checkin.user,
            ticket_ref,
            event_ref,
            checkin_record: checkin.key(),
            checked_in_at,
        });

        Ok(())
    }

    pub fn commit_attestation(
        ctx: Context<CommitAttestation>,
        ticket_ref: [u8; 32],
        event_ref: [u8; 32],
        checkin_tx_signature: [u8; 64],
        committed_at: i64,
    ) -> Result<()> {
        require!(committed_at > 0, RantiError::InvalidTimestamp);

        let checkin = &ctx.accounts.checkin_record;
        require!(checkin.ticket_ref == ticket_ref, RantiError::TicketRefMismatch);
        require!(checkin.event_ref == event_ref, RantiError::EventRefMismatch);

        let attestation = &mut ctx.accounts.attestation_record;

        if attestation.committed {
            require!(
                attestation.checkin_tx_signature == checkin_tx_signature,
                RantiError::AttestationAlreadyCommitted
            );
            require!(attestation.ticket_ref == ticket_ref, RantiError::TicketRefMismatch);
            require!(attestation.event_ref == event_ref, RantiError::EventRefMismatch);
            return Ok(());
        }

        attestation.user = ctx.accounts.user.key();
        attestation.ticket_ref = ticket_ref;
        attestation.event_ref = event_ref;
        attestation.checkin_tx_signature = checkin_tx_signature;
        attestation.committed_at = committed_at;
        attestation.bump = ctx.bumps.attestation_record;
        attestation.committed = true;

        emit!(AttestationCommitted {
            user: attestation.user,
            ticket_ref,
            event_ref,
            attestation_record: attestation.key(),
            committed_at,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        seeds = [b"config"],
        bump,
        space = 8 + Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ticket_ref: [u8; 32])]
pub struct CheckIn<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"checkin", user.key().as_ref(), &ticket_ref],
        bump,
        space = 8 + CheckInRecord::INIT_SPACE,
    )]
    pub checkin_record: Account<'info, CheckInRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(ticket_ref: [u8; 32])]
pub struct CommitAttestation<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        seeds = [b"checkin", user.key().as_ref(), &ticket_ref],
        bump = checkin_record.bump,
        constraint = checkin_record.user == user.key() @ RantiError::Unauthorized,
    )]
    pub checkin_record: Account<'info, CheckInRecord>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [b"attestation", user.key().as_ref(), &ticket_ref],
        bump,
        space = 8 + AttestationRecord::INIT_SPACE,
    )]
    pub attestation_record: Account<'info, AttestationRecord>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct CheckInRecord {
    pub user: Pubkey,
    pub ticket_ref: [u8; 32],
    pub event_ref: [u8; 32],
    pub checked_in_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct AttestationRecord {
    pub user: Pubkey,
    pub ticket_ref: [u8; 32],
    pub event_ref: [u8; 32],
    pub checkin_tx_signature: [u8; 64],
    pub committed_at: i64,
    pub bump: u8,
    pub committed: bool,
}

#[event]
pub struct ConfigInitialized {
    pub authority: Pubkey,
    pub config: Pubkey,
}

#[event]
pub struct CheckInRecorded {
    pub user: Pubkey,
    pub ticket_ref: [u8; 32],
    pub event_ref: [u8; 32],
    pub checkin_record: Pubkey,
    pub checked_in_at: i64,
}

#[event]
pub struct AttestationCommitted {
    pub user: Pubkey,
    pub ticket_ref: [u8; 32],
    pub event_ref: [u8; 32],
    pub attestation_record: Pubkey,
    pub committed_at: i64,
}

#[error_code]
pub enum RantiError {
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
    #[msg("Ticket reference mismatch")]
    TicketRefMismatch,
    #[msg("Event reference mismatch")]
    EventRefMismatch,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Attestation already committed")]
    AttestationAlreadyCommitted,
}
