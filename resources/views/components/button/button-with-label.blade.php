{{-- resources/views/components/button/button-with-label.blade.php --}}

@if (isset($labelFor) && isset($labelClasses))
    <label for="{{ $labelFor }}" class="{{ $labelClasses }}">
        @isset($labelTitle)
            {{ $labelTitle }}
        @else
            &nbsp;
        @endisset
    </label>
@endif

<div class="form-group">
    <button type="{{ $type }}" name="{{ $name }}" id="{{ $id }}" class="btn {{ $classes }}">
        @if (isset($iconClasses))
            <i class="{{ $iconClasses }}"></i>
        @endif
        {{ $slot }}
    </button>
</div>
