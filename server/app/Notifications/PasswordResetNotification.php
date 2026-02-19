<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordResetNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $resetUrl = config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:5173')) . '/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Reset Your Password - Mon Chez Moi')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->action('Reset Password', $resetUrl)
            ->line('This password reset link will expire in ' . config('auth.passwords.users.expire', 60) . ' minutes.')
            ->line('If you did not request a password reset, no further action is required.')
            ->salutation('Regards, The Mon Chez Moi Team');
    }

    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
