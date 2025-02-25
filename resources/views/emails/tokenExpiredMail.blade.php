@component('mail::message')
# Token Expiry!
## Email : {{ $username }}

**<p style="text-align: center;"><strong>{{ $message }}</strong></p>**
Thanks,<br>
{{ config('app.name') }}
@endcomponent
