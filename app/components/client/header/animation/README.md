# Next.js Ocean Theme Transition

## Cách dùng

Copy các file vào thư mục:

```txt
components/client/header/
```

Copy nội dung file `ocean-theme-transition.css` vào cuối:

```txt
app/globals.css
```

Import header:

```tsx
import { ClientHeader } from '@/components/client/header/ClientHeader';

export default function Page() {
  return <ClientHeader />;
}
```

## Điều kiện Tailwind

Trong `tailwind.config.ts`, cần dùng:

```ts
darkMode: 'class'
```

## Cơ chế

Bản này dùng View Transition API:

- Browser chụp UI cũ.
- React đổi class `dark` trên `<html>`.
- Browser chụp UI mới.
- CSS reveal UI mới bằng `clip-path: circle(...)`.

Kết quả: vùng sóng tới đâu, toàn bộ UI mới hiện tới đó.
