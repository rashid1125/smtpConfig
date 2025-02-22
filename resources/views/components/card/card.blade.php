{{-- resources/views/components/card/card.blade.php --}}
<div {{ $attributes->merge(['class' => 'card']) }}>
  {{ $slot }}
</div>
