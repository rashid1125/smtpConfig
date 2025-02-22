@component('mail::message')
# OTP Code!
# Company : {{ $otpCompany }}
## Dear {{ $otpUsername }},

**<p style="text-align: center;"><strong>{{ $otpCode }}</strong></p>**

The OTP is valid for **{{ $otpTime }}** minutes. Please do not share this code with anyone.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
