/* ============================================================
   Wise Floww — language switcher (EN / ES / PT)
   ------------------------------------------------------------
   EN is the source of truth: its markup is never edited. On load
   we snapshot the live innerHTML of every translatable node, then
   swap in ES / PT strings on demand and restore the snapshot for EN.
   Selection persists in localStorage.
   ============================================================ */
(function () {
  "use strict";

  /* Each entry: a selector + arrays of replacement innerHTML, one per
     matched element in document order. EN strings are read live. */
  var MAP = [
    /* ---------- NAV ---------- */
    { sel: ".nav-links > a",
      es: ["Soluciones", "Seguridad", "Contacto", "FAQ"],
      pt: ["Soluções", "Segurança", "Contato", "FAQ"] },

    /* ---------- HERO ---------- */
    { sel: ".hero h1",
      es: ['Las operaciones de tu negocio, <br>como nunca antes las <span class="lime">viste</span>.'],
      pt: ['As operações do seu negócio, <br>como você nunca <span class="lime">viu</span> antes.'] },
    { sel: ".hero-sub",
      es: ['<span class="hero-rule"></span>Wise Floww es una empresa de tecnología enfocada en transformar operaciones complejas en una vista operativa centralizada, integrando datos y herramientas para ayudar a los gerentes a identificar cuellos de botella, monitorear métricas clave y tomar decisiones más precisas.'],
      pt: ['<span class="hero-rule"></span>A Wise Floww é uma empresa de tecnologia focada em transformar operações complexas em uma visão operacional centralizada, integrando dados e ferramentas para ajudar gestores a identificar gargalos, acompanhar métricas-chave e tomar decisões mais precisas.'] },
    { sel: ".hero-actions a",
      es: ["Soluciones", "Verlo en vivo", "Contacto"],
      pt: ["Soluções", "Ver ao vivo", "Contato"] },

    /* ---------- INTRO ---------- */
    { sel: ".intro .left h2",
      es: ["Nacimos con la convicción de que cualquier operación compleja puede volverse más clara, más inteligente y más fácil de gestionar."],
      pt: ["Nascemos com a convicção de que qualquer operação complexa pode se tornar mais clara, mais inteligente e mais fácil de gerir."] },
    { sel: ".intro .right p",
      es: ["Muchas empresas ya tienen las herramientas, los datos y las personas que necesitan. El desafío es que todo está disperso entre sistemas, hojas de cálculo y rutinas manuales, lo que dificulta seguir prioridades y tomar decisiones."],
      pt: ["Muitas empresas já têm as ferramentas, os dados e as pessoas de que precisam. O desafio é que tudo fica espalhado entre sistemas, planilhas e rotinas manuais, dificultando acompanhar prioridades e tomar decisões."] },
    { sel: ".intro .link-dark",
      es: ["Nuestras Soluciones"],
      pt: ["Nossas Soluções"] },

    /* ---------- EYEBROWS (document order) ---------- */
    { sel: ".eyebrow",
      es: ["Realidad Actual", "Lo Que Ahora Es Posible", "Nuestras Soluciones", "Seguridad", "Sistemas Que Conectamos", "FAQ"],
      pt: ["Realidade Atual", "O Que Agora É Possível", "Nossas Soluções", "Segurança", "Sistemas Que Conectamos", "FAQ"] },

    /* ---------- CURRENT REALITY ---------- */
    { sel: ".reality .h2",
      es: ["La mayoría de las empresas aún funciona con hojas de cálculo, herramientas desconectadas y seguimientos manuales."],
      pt: ["A maioria das empresas ainda funciona com planilhas, ferramentas desconectadas e acompanhamentos manuais."] },
    { sel: ".reality .lead",
      es: ["La información se dispersa entre herramientas, equipos y rutinas. Los reportes tardan demasiado en actualizarse, el estado operativo se vuelve difícil de seguir y los gerentes batallan para ver lo que importa, alinear prioridades y tomar decisiones más precisas."],
      pt: ["As informações ficam espalhadas entre ferramentas, equipes e rotinas. Os relatórios demoram demais para atualizar, o status operacional fica difícil de acompanhar e os gestores têm dificuldade para enxergar o que importa, alinhar prioridades e tomar decisões mais precisas."] },
    { sel: ".reality .pcard h3",
      es: ["Herramientas desconectadas frenan a los equipos", "Las tareas manuales generan retrabajo", "Los gerentes no tienen visibilidad", "Las decisiones carecen de contexto completo"],
      pt: ["Ferramentas desconectadas atrasam as equipes", "Tarefas manuais geram retrabalho", "Os gestores não têm visibilidade", "As decisões não têm contexto completo"] },
    { sel: ".reality .pcard p",
      es: [
        "Los equipos saltan entre hojas de cálculo, sistemas y mensajes para ver qué requiere atención.",
        "Las personas pasan horas copiando, revisando y actualizando datos que deberían fluir solos.",
        "Los datos críticos están repartidos entre herramientas, por lo que el estado y las prioridades siguen siendo difíciles de seguir.",
        "Cuando la información sigue dispersa, los líderes deciden con contexto parcial y menos confianza."
      ],
      pt: [
        "As equipes pulam entre planilhas, sistemas e mensagens para ver o que precisa de atenção.",
        "As pessoas passam horas copiando, conferindo e atualizando dados que deveriam fluir sozinhos.",
        "Os dados críticos ficam espalhados entre ferramentas, então status e prioridades continuam difíceis de acompanhar.",
        "Quando as informações ficam dispersas, os líderes decidem com contexto parcial e menos confiança."
      ] },

    /* ---------- WHAT'S POSSIBLE NOW ---------- */
    { sel: ".possible .h2",
      es: ["Ahora, tus herramientas, datos y equipos por fin pueden funcionar como un solo sistema conectado."],
      pt: ["Agora, suas ferramentas, dados e equipes podem finalmente funcionar como um único sistema conectado."] },
    { sel: ".possible-cols h4",
      es: ["Identificamos dónde se dispersan los datos, las herramientas y las rutinas", "Construimos la vista de gestión centralizada"],
      pt: ["Identificamos onde dados, ferramentas e rotinas estão espalhados", "Construímos a visão de gestão centralizada"] },
    { sel: ".possible-cols p",
      es: [
        "Analizamos cómo funciona hoy el proceso, dónde vive la información, qué herramientas se usan y qué necesitan monitorear los gerentes para tomar mejores decisiones.",
        "Llevamos los datos críticos a dashboards, alertas y vistas operativas que ayudan a los gerentes a seguir el estado, detectar cuellos de botella y decidir con confianza."
      ],
      pt: [
        "Analisamos como o processo funciona hoje, onde a informação vive, quais ferramentas são usadas e o que os gestores precisam acompanhar para tomar melhores decisões.",
        "Levamos os dados críticos para dashboards, alertas e visões operacionais que ajudam os gestores a acompanhar o status, identificar gargalos e decidir com confiança."
      ] },

    /* ---------- OUR SOLUTIONS ---------- */
    { sel: ".solutions .h2",
      es: ["Convierte cada operación crítica en una vista de gestión centralizada que tu equipo realmente pueda usar."],
      pt: ["Transforme cada operação crítica em uma visão de gestão centralizada que sua equipe realmente consiga usar."] },
    { sel: ".solutions .lead",
      es: ["Desde ventas hasta operaciones de campo, Wise Floww mapea el flujo de trabajo, centraliza los datos críticos y crea vistas claras para las personas que gestionan el negocio todos los días."],
      pt: ["De vendas a operações de campo, a Wise Floww mapeia o fluxo de trabalho, centraliza os dados críticos e cria visões claras para as pessoas que gerenciam o negócio todos os dias."] },
    { sel: ".scard h3",
      es: ["Gestión de Ventas", "Atención al Cliente", "Operación Diaria", "Equipos de Campo", "Finanzas y Administración", "Procesos Personalizados"],
      pt: ["Gestão de Vendas", "Atendimento ao Cliente", "Operação Diária", "Equipes de Campo", "Financeiro e Administrativo", "Processos Personalizados"] },
    { sel: ".scard .body p",
      es: [
        "Centraliza leads, seguimientos, datos del pipeline, rutinas comerciales e indicadores clave de ventas en una vista de gestión clara.",
        "Monitorea solicitudes de clientes, rutinas de atención, tiempos de respuesta, casos abiertos e indicadores de relación entre canales y herramientas.",
        "Da visibilidad a los procesos internos, las rutinas manuales, los cuellos de botella operativos, los flujos de tareas y el desempeño del equipo.",
        "Centraliza actividades de campo, actualizaciones de estado, eventos operativos, datos geoespaciales e indicadores de desempeño para equipos distribuidos.",
        "Conecta rutinas financieras, hojas de cálculo, reportes, estado de pagos, controles administrativos y tareas recurrentes en una sola vista de gestión.",
        "¿Tienes un flujo de trabajo único en tu negocio? Diseñamos un sistema centralizado en torno a tus herramientas, datos y operación actuales."
      ],
      pt: [
        "Centralize leads, follow-ups, dados de pipeline, rotinas comerciais e indicadores-chave de vendas em uma visão de gestão clara.",
        "Acompanhe solicitações de clientes, rotinas de atendimento, tempos de resposta, chamados abertos e indicadores de relacionamento entre canais e ferramentas.",
        "Dê visibilidade aos processos internos, rotinas manuais, gargalos operacionais, fluxos de tarefas e desempenho da equipe.",
        "Centralize atividades de campo, atualizações de status, eventos operacionais, dados geoespaciais e indicadores de desempenho para equipes distribuídas.",
        "Conecte rotinas financeiras, planilhas, relatórios, status de pagamentos, controles administrativos e tarefas recorrentes em uma única visão de gestão.",
        "Tem um fluxo de trabalho único no seu negócio? Desenhamos um sistema centralizado em torno das suas ferramentas, dados e operação atuais."
      ] },
    { sel: ".scard .tag",
      es: [
        "Visibilidad del pipeline · Seguimiento más rápido",
        "Mejor seguimiento · Mejor experiencia",
        "Control operativo · Menos retrabajo",
        "Visibilidad de campo · Estado en tiempo real",
        "Menos consolidación manual",
        "Proyecto a medida"
      ],
      pt: [
        "Visibilidade do pipeline · Follow-up mais rápido",
        "Melhor acompanhamento · Experiência aprimorada",
        "Controle operacional · Menos retrabalho",
        "Visibilidade de campo · Status em tempo real",
        "Menos consolidação manual",
        "Projeto sob medida"
      ] },

    /* ---------- SECURITY ---------- */
    { sel: ".security .h2",
      es: ["Datos críticos,<br>protegidos desde el primer día."],
      pt: ["Dados críticos,<br>protegidos desde o dia um."] },
    { sel: ".security .lead",
      es: ["Wise Floww trabaja con datos críticos del negocio, rutinas operativas y sistemas internos. Cada proyecto se diseña con límites de acceso claros, uso responsable de los datos, confidencialidad y documentación desde el primer día."],
      pt: ["A Wise Floww trabalha com dados críticos do negócio, rotinas operacionais e sistemas internos. Cada projeto é desenhado com limites de acesso claros, uso responsável dos dados, confidencialidade e documentação desde o primeiro dia."] },
    { sel: ".sec-points .point h4",
      es: ["Acceso limitado", "Uso de datos con propósito", "Sin migraciones innecesarias", "Documentación clara", "Validación con intervención humana"],
      pt: ["Acesso limitado", "Uso de dados com propósito", "Sem migrações desnecessárias", "Documentação clara", "Validação com intervenção humana"] },
    { sel: ".sec-points .point p",
      es: [
        "Conectamos solo las herramientas y fuentes de datos necesarias para el proyecto, siguiendo los límites de acceso definidos con tu equipo.",
        "Tus datos se utilizan solo para construir la vista de gestión acordada, los dashboards, las alertas y los flujos operativos.",
        "No reemplazamos tus sistemas actuales. Creamos una capa segura que hace que tus herramientas existentes funcionen mejor en conjunto.",
        "Cada proyecto incluye documentación básica para que tu equipo entienda cómo funciona el sistema y cómo usarlo correctamente.",
        "Gerentes de confianza y especialistas de cada área permanecen involucrados en el proceso, validando indicadores, reglas de negocio, excepciones y vistas operativas antes de usarse para apoyar decisiones."
      ],
      pt: [
        "Conectamos apenas as ferramentas e fontes de dados necessárias para o projeto, seguindo os limites de acesso definidos com a sua equipe.",
        "Seus dados são usados apenas para construir a visão de gestão acordada, os dashboards, os alertas e os fluxos operacionais.",
        "Não substituímos os seus sistemas atuais. Criamos uma camada segura que faz as suas ferramentas existentes funcionarem melhor em conjunto.",
        "Cada projeto inclui documentação básica para que a sua equipe entenda como o sistema funciona e como usá-lo corretamente.",
        "Gestores de confiança e especialistas de cada área permanecem envolvidos no processo, validando indicadores, regras de negócio, exceções e visões operacionais antes de serem usados para apoiar decisões."
      ] },

    /* ---------- SYSTEMS WE CONNECT ---------- */
    { sel: ".systems .h2",
      es: ["Tus herramientas actuales,<br>por fin trabajando juntas."],
      pt: ["Suas ferramentas atuais,<br>finalmente trabalhando juntas."] },
    { sel: ".systems .lead",
      es: ["Desde hojas de cálculo y CRMs hasta ERPs, formularios, apps de mensajería y sistemas internos. Wise Floww conecta las herramientas que tu equipo ya usa sin forzar nuevas migraciones ni cambios de stack."],
      pt: ["De planilhas e CRMs a ERPs, formulários, apps de mensagens e sistemas internos. A Wise Floww conecta as ferramentas que a sua equipe já usa sem forçar novas migrações ou mudanças de stack."] },
    { sel: ".connect-card .ck",
      es: ["Herramientas y Sistemas"],
      pt: ["Ferramentas e Sistemas"] },
    { sel: ".connect-card h3",
      es: ["Creado para conectar las herramientas en las que tu equipo ya confía."],
      pt: ["Feito para conectar as ferramentas em que a sua equipe já confia."] },
    { sel: ".connect-card .sub",
      es: ["Wise Floww trabaja en torno a tu stack existente para centralizar los datos, reportes y flujos de trabajo más importantes para tu operación."],
      pt: ["A Wise Floww trabalha em torno do seu stack existente para centralizar os dados, relatórios e fluxos de trabalho mais importantes para a sua operação."] },
    { sel: ".int-grid .k",
      es: ["Hojas de cálculo", "CRM", "Soporte al Cliente", "Correo", "Mensajería", "Formularios y Encuestas", "Operaciones de Campo", "Dashboards", "Automatización", "Sistemas Empresariales", "¿Usas otra distinta?"],
      pt: ["Planilhas", "CRM", "Suporte ao Cliente", "E-mail", "Mensagens", "Formulários e Pesquisas", "Operações de Campo", "Dashboards", "Automação", "Sistemas Corporativos", "Usa outra diferente?"] },
    { sel: ".int-grid .v",
      es: ["Excel / CSV / Google Sheets", "HubSpot / Salesforce", "Zendesk / Intercom / Freshdesk", "Gmail / Outlook", "WhatsApp / Meta", "Google Forms / Typeform", "ArcGIS / Field Maps", "Power BI / Looker Studio", "Make / Zapier / n8n", "ERPs / Sistemas internos", "Hablemos, la integramos."],
      pt: ["Excel / CSV / Google Sheets", "HubSpot / Salesforce", "Zendesk / Intercom / Freshdesk", "Gmail / Outlook", "WhatsApp / Meta", "Google Forms / Typeform", "ArcGIS / Field Maps", "Power BI / Looker Studio", "Make / Zapier / n8n", "ERPs / Sistemas internos", "Vamos conversar, nós integramos."] },

    /* ---------- CTA ---------- */
    { sel: ".cta-tag",
      es: ["Verlo en vivo"],
      pt: ["Ver ao vivo"] },
    { sel: ".cta-card h2",
      es: ["¿Listo para que tu operación fluya de forma más inteligente?"],
      pt: ["Pronto para fazer a sua operação fluir de forma mais inteligente?"] },
    { sel: ".cta-card .btn",
      es: ["Contáctanos"],
      pt: ["Fale conosco"] },

    /* ---------- FAQ ---------- */
    { sel: ".faq h2",
      es: ["Preguntas frecuentes"],
      pt: ["Perguntas frequentes"] },
    { sel: ".faq-q",
      es: [
        '¿Qué hace exactamente Wise Floww?<span class="ic"></span>',
        '¿Necesitamos reemplazar nuestros sistemas actuales?<span class="ic"></span>',
        '¿Qué tipo de herramientas puede conectar Wise Floww?<span class="ic"></span>',
        '¿Cuánto tiempo toma un proyecto?<span class="ic"></span>',
        '¿Nuestros datos están seguros?<span class="ic"></span>',
        '¿Qué pasa después del primer proyecto?<span class="ic"></span>'
      ],
      pt: [
        'O que a Wise Floww faz exatamente?<span class="ic"></span>',
        'Precisamos substituir os nossos sistemas atuais?<span class="ic"></span>',
        'Que tipo de ferramentas a Wise Floww pode conectar?<span class="ic"></span>',
        'Quanto tempo leva um projeto?<span class="ic"></span>',
        'Os nossos dados estão seguros?<span class="ic"></span>',
        'O que acontece depois do primeiro projeto?<span class="ic"></span>'
      ] },
    { sel: ".faq-a .inner",
      es: [
        "Wise Floww ayuda a las empresas a convertir datos dispersos, herramientas desconectadas y rutinas manuales en vistas operativas centralizadas para mejores decisiones de gestión.",
        "No. Wise Floww está diseñado para trabajar en torno a las herramientas que tu equipo ya usa, conectando los sistemas y datos que importan sin forzar migraciones innecesarias.",
        "Podemos trabajar con hojas de cálculo, CRMs, correos, apps de mensajería, ERPs, formularios, dashboards, bases de datos, herramientas de campo, sistemas de soporte al cliente y plataformas internas.",
        "La mayoría de los proyectos se entregan en pocas semanas, según la complejidad de la operación, la cantidad de sistemas involucrados y la rapidez con que se proporcionan los datos y accesos.",
        "Sí. Cada proyecto se diseña con límites de acceso claros, uso responsable de los datos, confidencialidad, documentación y validación humana por parte de personas de confianza dentro de tu operación.",
        "Después del primer proyecto, Wise Floww puede ayudar a mantener, monitorear y evolucionar el sistema con nuevos indicadores, nuevas integraciones, mejoras controladas y vistas operativas adicionales."
      ],
      pt: [
        "A Wise Floww ajuda as empresas a transformar dados dispersos, ferramentas desconectadas e rotinas manuais em visões operacionais centralizadas para melhores decisões de gestão.",
        "Não. A Wise Floww é feita para trabalhar em torno das ferramentas que a sua equipe já usa, conectando os sistemas e dados que importam sem forçar migrações desnecessárias.",
        "Podemos trabalhar com planilhas, CRMs, e-mails, apps de mensagens, ERPs, formulários, dashboards, bancos de dados, ferramentas de campo, sistemas de suporte ao cliente e plataformas internas.",
        "A maioria dos projetos é entregue em poucas semanas, dependendo da complexidade da operação, da quantidade de sistemas envolvidos e da rapidez com que os dados e acessos são fornecidos.",
        "Sim. Cada projeto é desenhado com limites de acesso claros, uso responsável dos dados, confidencialidade, documentação e validação humana por pessoas de confiança dentro da sua operação.",
        "Depois do primeiro projeto, a Wise Floww pode ajudar a manter, monitorar e evoluir o sistema com novos indicadores, novas integrações, melhorias controladas e visões operacionais adicionais."
      ] },

    /* ---------- FOOTER ---------- */
    { sel: ".foot-brand p",
      es: ["Convertimos operaciones dispersas en vistas de gestión centralizadas."],
      pt: ["Transformamos operações dispersas em visões de gestão centralizadas."] },
    { sel: ".fcol-solutions .ck",
      es: ["Soluciones"],
      pt: ["Soluções"] },
    { sel: ".fcol-solutions a",
      es: ["Gestión de Ventas", "Atención al Cliente", "Operación Diaria", "Equipos de Campo", "Finanzas y Administración", "Procesos Personalizados"],
      pt: ["Gestão de Vendas", "Atendimento ao Cliente", "Operação Diária", "Equipes de Campo", "Financeiro e Administrativo", "Processos Personalizados"] },
    { sel: ".fcol-company .ck",
      es: ["Empresa"],
      pt: ["Empresa"] },
    { sel: ".fcol-company ul a",
      es: ["Seguridad", "FAQ", "Contacto"],
      pt: ["Segurança", "FAQ", "Contato"] },
    { sel: ".foot-grid > .fcol:last-child .ck",
      es: ["Contacto"],
      pt: ["Contato"] },
    { sel: ".foot-grid > .fcol:last-child ul a",
      es: ["Hablemos"],
      pt: ["Fale com a gente"] },
    { sel: ".cp",
      es: ["© 2026 Wise Floww. Todos los derechos reservados."],
      pt: ["© 2026 Wise Floww. Todos os direitos reservados."] }
  ];

  var TITLES = {
    en: document.title,
    es: "Wise Floww — Las operaciones de tu negocio, como nunca antes las viste.",
    pt: "Wise Floww — As operações do seu negócio, como você nunca viu antes."
  };

  var STORE_KEY = "wf-lang";
  var snapshot = []; // parallel to MAP: arrays of original EN innerHTML

  function snap() {
    MAP.forEach(function (entry) {
      var els = document.querySelectorAll(entry.sel);
      var orig = [];
      els.forEach(function (el) { orig.push(el.innerHTML); });
      snapshot.push(orig);
    });
  }

  // collect every translatable element, in MAP order
  function collectEls() {
    var out = [];
    MAP.forEach(function (entry) {
      document.querySelectorAll(entry.sel).forEach(function (el) { out.push(el); });
    });
    return out;
  }

  // swap the actual content + document-level state (no animation)
  function swap(lang) {
    MAP.forEach(function (entry, ei) {
      var els = document.querySelectorAll(entry.sel);
      var src = (lang === "en") ? snapshot[ei] : entry[lang];
      els.forEach(function (el, i) {
        var val = src && src[i];
        if (typeof val === "string") el.innerHTML = val;
      });
    });

    // document-level
    document.documentElement.setAttribute("lang", lang);
    if (TITLES[lang]) document.title = TITLES[lang];

    // active state on the EN / ES / PT switcher
    document.querySelectorAll(".lang a").forEach(function (a) {
      var code = (a.textContent || "").trim().toLowerCase();
      a.classList.toggle("active", code === lang);
    });

    // any open FAQ item: recompute its expanded height for the new text length
    document.querySelectorAll(".faq-item.open .faq-a").forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + "px";
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  var current = "en";
  var animTimer = null;
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // soft crossfade: fade the page copy out, swap, fade back in
  function apply(lang, animate) {
    if (lang !== "es" && lang !== "pt") lang = "en";
    if (lang === current && animate) return;
    current = lang;

    if (!animate || reduceMotion) { swap(lang); return; }

    var els = collectEls();
    if (animTimer) clearTimeout(animTimer);

    els.forEach(function (el) {
      // inline !important beats both the hero entrance-animation's held
      // end-state (fill: both) AND the mobile `opacity:1 !important` rule,
      // so the crossfade actually reaches the hero title + subtitle too.
      el.style.setProperty("animation", "none", "important");
      el.style.setProperty("transition", "opacity .16s ease", "important");
      el.style.setProperty("opacity", "0", "important");
    });

    animTimer = setTimeout(function () {
      swap(lang);
      // fade back in — done directly (NOT inside requestAnimationFrame, which a
      // backgrounded tab can pause, leaving the copy stuck at opacity 0)
      els.forEach(function (el) {
        el.style.setProperty("transition", "opacity .3s ease", "important");
        el.style.setProperty("opacity", "1", "important");
      });
      setTimeout(function () {
        els.forEach(function (el) {
          el.style.removeProperty("transition");
          el.style.removeProperty("opacity");
          // animation stays "none" so the hero entrance can't replay on swap
        });
      }, 340);
    }, 165);
  }

  function wire() {
    document.querySelectorAll(".lang a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        apply((a.textContent || "").trim().toLowerCase(), true);
      });
    });
  }

  function init() {
    snap();
    wire();
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    apply(saved && saved !== "en" ? saved : "en", false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
