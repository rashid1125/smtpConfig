{{-- resources/views/components/transaction-form-header.blade.php --}}
<div class="row mt-2">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div class="w-full bg-white p-3 border border-gray-200 rounded-lg mt-2 shadow">
            <div class="row">
                @isset($title)
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-12">
                        <h1 class="text-sm text-md text-lg text-uppercase font-weight-bold"><span
                                class="badge badge-primary badge_style"><i class="fa fa-tasks"></i></span> <?= $title ?></h1>
                    </div>
                    @isset($position)
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-8 col-xl-8" hide>
                            <div class="{{ $position === 'top' ? 'float-right' : 'float-left' }}">
                                @foreach ($buttons as $button)
                                    <button type="button" id="{{ $button['id'] }}" class="{{ $button['class'] }}">
                                        @if (isset($button['iconClass']))
                                            <i class="{{ $button['iconClass'] }}"></i>
                                        @endif
                                        {{ $button['title'] }}
                                    </button>
                                @endforeach
                            </div>
                        </div>
                    @endisset
                @else
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <div class="{{ $position === 'top' ? 'float-right' : 'float-left' }}">
                            @foreach ($buttons as $button)
                                <button type="button" id="{{ $button['id'] }}Bottom" class="{{ $button['class'] }}">
                                    @if (isset($button['iconClass']))
                                        <i class="{{ $button['iconClass'] }}"></i>
                                    @endif
                                    {{ $button['title'] }}
                                </button>
                            @endforeach
                        </div>
                    </div>
                @endisset
            </div>
        </div>
    </div>
</div>
@isset($position)
    @if ($position === 'bottom')
        <div class="row mt-5"></div>
    @endif
@endisset
