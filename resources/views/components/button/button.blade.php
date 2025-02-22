<!-- resources/views/components/button.blade.php -->

@props(['buttonIcone' => false, 'buttontext' => '', 'iconeClass' => ''])

<button {{ $attributes }} data-toggle="tooltip">
    @if ($buttonIcone)
        <i class="{{ $iconeClass }}"></i>
    @endif
</button>
