const COMPANIES = ['Northwind', 'Acme Labs', 'Vela', 'Quanta', 'Brightline', 'Orbit'];

export function LogoCloud() {
    return (
        <section className="border-y border-white/5 py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <p className="text-center text-xs font-medium tracking-widest text-white/35 uppercase">
                    Trusted by knowledge-driven teams
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                    {COMPANIES.map((name) => (
                        <span
                            key={name}
                            className="text-lg font-semibold tracking-tight text-white/30 transition-colors hover:text-white/55"
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
