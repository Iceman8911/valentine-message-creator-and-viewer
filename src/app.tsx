import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
	return (
		<Router
			base={import.meta.env.SERVER_BASE_URL}
			root={(props) => (
				<div class="**:scrollbar-thin **:scrollbar-thumb-primary **:scrollbar-track-base-100 h-screen w-screen overflow-auto">
					<Suspense>{props.children}</Suspense>
				</div>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
