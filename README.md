<h1 align="center">
Server Mui
</h1>
<p align="center">
Dynamic Material UI for React Server Components
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/server-mui)](https://www.npmjs.com/package/server-mui)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  

</div>

- [Why Use This?](#why-use-this)
- [Installation](#installation)
- [Quick Migration](#quick-migration)
- [Key Features](#key-features)
- [When to Use](#when-to-use)
- [Full Example](#full-example)
- [ThemeProvider Options](#themeprovider-options)
  - [`theme` *(Required)*](#theme-required)
  - [`emotionKey` *(Optional)*](#emotionkey-optional)
  - [`emotionInstance` *(Optional)*](#emotioninstance-optional)
  - [`styleInjector` *(Optional)*](#styleinjector-optional)
  - [Example Usage](#example-usage)
- [Advanced](#advanced)
  - [Mui Interoperability](#mui-interoperability)

### Why Use This?

The official recommendation for using Mui with React Server Components is to use [Pigment CSS](https://github.com/mui/pigment-css), however it comes with large compromises and changes to your codebase. This library aims to provide a drop-in replacement for Mui in Server Components.

🔹 **Fix Pigment CSS Limitations**  
```tsx
// Pigment CSS fails here - this works!
<Box sx={ await fetchSx() } />
```
- Pigment requires the keys in the sx prop to be statically defined at build time, but React Server Components might run on each request

🔹 **Keep MUI Functionality**  
```tsx
// Same props you already use (even with breakpoints)
<Grid container spacing={{ xs: 2, md: 4 }} />
```

🔹 **Pre-render to html**  
```tsx
// This syntax in a Server Component
<Box sx={{ px: 2 }} />

// Will get pre-rendered to the following using Mui's theme spacing
<div style="padding-left:16px; padding-right:16px" />
```

🔹 **CSS Variables are optional**
```tsx
// Conditionals can be used without CSS variables
<Container sx={theme.palette.mode === "dark" ? darkStyle : lightStyle} />
```


🔹 **Automatic Server/Client Split**  
```tsx
// Works in both environments (Server Components ignore dynamic props like onClick)
<Box onClick={log} sx={dynamicStyles} />
```
---  

### Installation

```bash
npm install server-mui @mui/material
```

### Quick Migration

1. **Import the Theme Provider**  
```diff
import { ThemeProvider } from 'server-mui';
```

2. **Wrap Root Layout**  
```tsx
// app/layout.tsx
<body>
  <ThemeProvider theme={yourTheme}>
    {children}
  </ThemeProvider>
</body>
```

3. **Replace Layout Components**  
```diff
- import { Box } from '@mui/material';
- import Stack from "@mui/material/Stack
+ import { Box } from 'server-mui';
+ import Stack from 'server-mui/lib/Stack'
```
- Note: Currently only Box is exported, (Stack, Grid, and Container will soon be added, similar to PigmentCss). You can use the regular Mui Components for the others since they are mostly interactive (eg. Button and Accordion require client side API's). You can also fashion your own with the styled function below.

4. **Replace Styled Function**  
```diff
- import { styled } from '@mui/material/styles';
+ import { styled } from 'server-mui/lib/styles';
```

**<em>Note</em>**

The api is similar to Mui and falls back to Mui in client contexts, so you can either replace your mui components or import components exclusively on the server and use them.
```tsx
// Either of these work

// Either import and replace all your Mui references
import { Box, ThemeProvider } from 'server-mui';

// Or import it separately and use only in your Server Components
import { Box as ServerBox, ThemeProvider as ServerThemeProvider } from 'server-mui';
```
See [below](#mui-interoperability) for a more advanced way to incorporate with Mui

---  

### Key Features  

**Dynamic Server Styles**  
```tsx
// Server Component
<Box sx={{
  bgcolor: (await getUserPreferences()).color,
  p: { xs: 2, md: 4 }
}} />
```

**Client Interoperability**  
```tsx
'use client';
import { Box } from 'server-mui';

// Works with client hooks
<Box sx={{ color: isHovered ? 'red' : 'blue' }} />
```

**Full Theme Access**  
```tsx
// Type-safe theme values
<Box sx={theme => ({
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: { p: 4 }
})} />
```

---  

### When to Use  

|                         | Pigment CSS | This Lib |
|-------------------------|-------------|----------|
| **Build-Time Styles**   | ✅ Best     | ✅ Works |
| **Runtime Values**      | ❌ Broken   | ✅ Fixed |
| **RSC Compatibility**   | ⚠️ Partial  | ✅ Full  |
| **Bundle Size**         | 15kb        | 2kb core |

---  

### Full Example  
The following entire page will be pre-rendered server side into regular HTML in NextJS. Other React Server frameworks are supported as well.

```tsx
// app/page.tsx
import { Stack, Box, styled, useTheme } from 'server-mui';

const DynamicCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'all 0.2s',
}));

export default async function Page() {
  const data = await fetchData();
  const spacing = useTheme().spacing

  return (
    <Stack spacing={4}>
      <DynamicCard sx={{
        bgcolor: data.color,
        '&:hover': { transform: 'scale(1.02)' }
      }}>
        {data.content}
      </DynamicCard>
      <Box sx={{ py: 4, m: spacing(4), color: "primary.main" }}> Example </Box>
    </Stack>
  );
}

// app/layout.tsx
import { ThemeProvider } from 'server-mui';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({});

  return (
      <html lang="en">
        <body>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </body>
      </html>
  );
}
```
---

### ThemeProvider Options

The `ThemeProvider` accepts the following options to customize server-side behavior:

#### `theme` *(Required)*
- **Type:** `Theme` (MUI theme object)  
  The Material-UI theme to be used on the server.  
  **Example:**
  ```tsx
  import { createTheme } from '@mui/material/styles';
  
  const theme = createTheme({
    // Your theme configuration
  });
  ```

#### `emotionKey` *(Optional)*
- **Type:** `string`  
  Custom cache key for Emotion styles. Defaults to `'sui'`.  
  Use this to avoid class name collisions when multiple Emotion instances are present.

#### `emotionInstance` *(Optional)*
- **Type:** `Emotion`  
  Provide a custom Emotion instance. Useful when you want to share an existing Emotion instance.  
  Defaults to the library's internal Emotion instance.

#### `styleInjector` *(Optional)*
- **Type:**  
  ```tsx
  ({ headerStyles, uniqueClassName }: {
    headerStyles: string;
    uniqueClassName: string
  }) => React.ReactNode
  ```  
  Custom component for adding generated styles to the html head.

#### Example Usage
```tsx
import { ThemeProvider } from 'server-mui';

const RootLayout = ({ children }) => (
  <ThemeProvider
    theme={customTheme}
    emotionKey="my-app"
    emotionInstance={myEmotion}
    styleInjector={({ headerStyles, uniqueClassName }) => (
      <CustomStyleTag
        data-css={`${uniqueClassName}-styles`}
        css={headerStyles}
      />
    )}
  >
    {children}
  </ThemeProvider>
);
```

---  

### Advanced

#### Mui Interoperability
You can also use the library directly instead of as a replacement for Mui. You would just have to let us know your theme with the `registerTheme` function.
```tsx
// In a client file like client.tsx
"use client";
import { Box } from "@mui/material";

// And in a server file app/page.tsx
import { Box as ServerBox } from "server-mui";

// And skip our ThemeProvider completely
import { registerTheme } from "server-mui";

export const RootLayout = async ({children}) => {
  registerTheme(theme)
  return <body>{children}</body>
}

// Or even process the sxProp yourself
import { processSx } from "server-mui"

export const MyButton = () => {
  return <button style={ processSx({ pt: 5 }).styleObject }> A button </button>
}
```

<em>Note: we internally use Mui's `unstable_styleFunctionSx` to process the sxProp with the registered theme.</em>

---  

**License**  
MIT
