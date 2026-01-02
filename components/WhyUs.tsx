import React from 'react';

const WhyUs: React.FC = () => {
  const cards = [
    {
      title: "Government-Ready",
      label: "Compliance",
      desc: "Built from the ground up to meet strict national security protocols and administrative compliance standards."
    },
    {
      title: "Proven Expertise",
      label: "LMS Scaling",
      desc: "Architecting systems for national skilling missions with millions of active learners across diverse demographics."
    },
    {
      title: "Inclusive Design",
      label: "UI/UX Tier",
      desc: "Accessible, multilingual interfaces that ensure no citizen is left behind in the digital transformation journey."
    },
    {
      title: "Mission-Ready",
      label: "Execution",
      desc: "End-to-end delivery from initial digital strategy to high-performance deployment and technical support."
    }
  ];

  return (
    <section className="py-20 bg-white relative border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            {/* <h2 className="text-accent text-base font-black uppercase tracking-ultra mb-8">Premium Differentiation</h2> */}
            <h3 className="text-5xl font-display font-black text-obsidian-900">Why Governments <br />Trust <span className="text-accent italic">VersionLabs</span>.</h3>
          </div>
          <div className="bg-slate-50 p-6 border-l-2 border-accent max-w-sm shadow-sm">
            <p className="text-slate-600 text-base italic font-light">
              "Digital infrastructure is not just code; it's the foundation of modern public trust."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden rounded-sm">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-12 hover:bg-slate-50 transition-colors group">
              <span className="block text-accent text-base font-black uppercase tracking-ultra mb-10">{card.label}</span>
              <h4 className="text-base font-display font-black text-obsidian-900 mb-6 group-hover:translate-x-2 transition-transform">{card.title}</h4>
              <p className="text-slate-500 text-base leading-relaxed font-light">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;