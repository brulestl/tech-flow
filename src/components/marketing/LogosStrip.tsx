export default function LogosStrip() {
  const logos = ['rum','logopipsum','coc','lil'];
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <p className="mb-6 text-center text-sm uppercase text-muted-foreground">Trusted by teams at</p>
      <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
        {logos.map(l => (
          <img key={l} alt={`${l} logo`} src={`https://placehold.co/100x40?text=${l}`} className="h-6 w-auto" />
        ))}
      </div>
    </section>
  );
}
