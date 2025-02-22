{{-- resources/views/components/table/table-data-cell-right.blade.php --}}

<td {{ $attributes->merge(['class' => 'py-2 px-2 text-md align-middle text-right']) }}>
    {{ $slot }}
</td>
