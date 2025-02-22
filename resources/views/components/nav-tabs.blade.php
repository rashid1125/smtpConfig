{{-- resources/views/components/nav-tabs.blade.php --}}
<ul class="nav nav-tabs card-header-tabs">
    @foreach ($tabs as $tab)
        <li class="nav-item">
            <a class="nav-link {{ $loop->first ? 'active' : '' }}" data-toggle="tab" href="#{{ $tab['id'] }}">
                {{ $tab['title'] }}
            </a>
        </li>
    @endforeach
</ul>
