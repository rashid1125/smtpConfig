@if (isset($postingInwardGatePassMethod) || isset($postingInspectionsMethod))
    <div class="input-group flex-nowrap">
        <select class="form-control select2" id="{{ $id }}" name="{{ $name }}" data-width="100%">
        </select>
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
@elseif (isset($postingOutwardGatePassMethod))
    <div class="input-group flex-nowrap">
        <select class="form-control select2" id="{{ $id }}" name="{{ $name }}" data-width="100%" {{ isset($isDisabled) ? 'disabled' : '' }}>
        </select>
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
@else
    <div class="form-group">
        <select class="form-control select2" id="{{ $id }}" name="{{ $name }}" data-width="100%"
            {{ isset($isDisabled) ? 'disabled' : '' }}>
        </select>
    </div>
@endif
