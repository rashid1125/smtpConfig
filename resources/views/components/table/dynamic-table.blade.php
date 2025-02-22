<x-table.table-component :id="$id" :class="$class">
    <x-table.table-head>
        <x-table.table-row>
            @foreach ($headers as $header)
                <x-table.table-header-cell class="{{ $header['class'] ?? '' }}">
                    {{ $header['content'] }}
                </x-table.table-header-cell>
            @endforeach
        </x-table.table-row>
    </x-table.table-head>
    <tbody>
        {{ $slot }}
    </tbody>
</x-table.table-component>