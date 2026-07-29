export default function PageHeader({ title, intro }: { title: string; intro: string }) {
  return (
    <section className="container-obin pb-6 pt-16 md:pt-20">
      <h1>{title}</h1>
      <p className="measure mt-5 text-lead text-content-secondary">{intro}</p>
    </section>
  );
}
