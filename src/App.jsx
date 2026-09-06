import PhotoViewer from "./components/PhotoViewer";

export default function App() {
  return (
    <main className="h-dvh w-full bg-stone-100 flex flex-col items-center justify-center p-3 overflow-hidden select-none touch-none">
      <PhotoViewer />
    </main>
  );
}