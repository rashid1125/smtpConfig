{{-- resources/views/components/inputs/input-group.blade.php --}}

<div class="input-group">
    @if (isset($prepend))
        <div class="input-group-prepend">
            <span class="input-group-text">{!! $prepend !!}</span>
        </div>
    @endif

    <input type="text" name="{{ $name }}" id="{{ $id }}" class="form-control {{ $class }}"
        data-toggle="tooltip" title="{{ $title }}" placeholder="{{ $placeholder }}" {{ $disabled ?? '' }}>

    @if (isset($isAppendHtml) && $isAppendHtml)
        <div class="input-group-append">
            {!! $append !!}
        </div>
    @elseif (isset($append))
        <div class="input-group-append">
            <span class="input-group-text">{{ $append }}</span>
        </div>
    @endif

    @if (isset($isEnabledButton) && $isEnabledButton)
        @if (isset($includeButton))
            <div class="input-group-append">
                <button id="{{ $buttonId ?? '' }}" type="{{ $buttonType ?? 'button' }}"
                    class="btn {{ $buttonClass ?? 'btn-primary' }}">
                    {!! $buttonText !!}
                </button>
            </div>
        @endif
    @endif
</div>
