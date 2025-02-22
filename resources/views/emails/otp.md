# OTP Code!

## Company: {{ $otpCompany }}

### Dear {{ $otpUsername }},

<p style="text-align: center; font-size: 24px; font-weight: bold;">
     {{ $otpCode }}
</p>

The OTP is valid for {{ $otpTime }} minutes. Please do not share this code with anyone.

Thanks,<br>
{{ config('app.name') }}
