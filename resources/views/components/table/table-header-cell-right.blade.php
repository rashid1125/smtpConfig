{{-- resources/views/components/table/table-header-cell-right.blade.php --}}

<th {{ $attributes->merge(['class' => 'py-2 px-2 text-md align-middle text-right']) }}>
    {{ $slot }}
</th>
