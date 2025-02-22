@php
    $cardNavTabActive = $cardNavTabActive ?? false;
@endphp
@if ($cardNavTabActive)
    <li class="nav-item"><a class="nav-link active" href="#{{ $cardNavTabLink }}"
            data-toggle="tab">{{ $cardNavTabValue }}</a></li>
@else
    <li class="nav-item"><a class="nav-link" href="#{{ $cardNavTabLink }}" data-toggle="tab">{{ $cardNavTabValue }}</a></li>
@endif