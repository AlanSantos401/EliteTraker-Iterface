import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';

import { RouterProvider } from "react-router-dom";

import { UserProvider } from "./hooks/use-user";
import { Router } from "./routes";

export function App() {
    return (
        <UserProvider>
            <MantineProvider defaultColorScheme='dark'>
			  <RouterProvider router={Router} />
            </MantineProvider>
		</UserProvider>
    )
}