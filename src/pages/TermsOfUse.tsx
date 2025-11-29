
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ScrollText, Shield, User, Globe, AlertTriangle, FileText, Scale, Phone } from 'lucide-react';

const termsData = [
  {
    id: 'overview',
    title: 'Përmbledhje',
    icon: ScrollText,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Përmbledhje e Kushte të Përdorimit</h3>
      <p class="mb-4">Mirë se vini në Shqipet! Këto kushte të përdorimit rregullojnë përdorimin tuaj të platformës sonë sociale. Duke u regjistruar dhe përdorur shërbimet tona, ju pranoni t'i respektoni këto kushte.</p>
      <ul class="list-disc list-inside space-y-2">
        <li>Duhet të jeni të paktën 16 vjeç për t'u regjistruar</li>
        <li>Jeni përgjegjës për sigurinë e llogarisë tuaj</li>
        <li>Duhet të respektoni të drejtat e përdoruesve të tjerë</li>
        <li>Ndaloheni të publikoni përmbajtje të dëmshme ose të paligjshme</li>
      </ul>
    `
  },
  {
    id: 'account',
    title: 'Llogaria Juaj',
    icon: User,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Menaxhimi i Llogarisë</h3>
      <p class="mb-4">Për të përdorur Shqipet, duhet të krijoni një llogari dhe të jepni informacione të sakta.</p>
      <h4 class="font-semibold text-red-400 mb-2">Krijimi i Llogarisë:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Duhet të jeni të paktën 16 vjeç</li>
        <li>Informacionet duhet të jenë të sakta dhe të vërteta</li>
        <li>Çdo person mund të ketë vetëm një llogari</li>
        <li>Nuk lejohen llogari të rreme ose mashtrimi</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Siguria e Llogarisë:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Jeni përgjegjës për ruajtjen e fjalëkalimit tuaj</li>
        <li>Duhet të na njoftoni menjëherë për çdo përdorim të paautorizuar</li>
        <li>Nuk duhet të ndani llogarinë tuaj me të tjerë</li>
      </ul>
    `
  },
  {
    id: 'content',
    title: 'Përmbajtja',
    icon: FileText,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Përmbajtja dhe Publikimi</h3>
      <p class="mb-4">Ju jeni përgjegjës për të gjithë përmbajtjen që publikoni në Shqipet.</p>
      <h4 class="font-semibold text-red-400 mb-2">Përmbajtje e Lejuar:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Foto, video dhe tekste origjinale</li>
        <li>Përmbajtje pozitive dhe konstruktive</li>
        <li>Diskutime të respektueshme</li>
        <li>Ndarje të përvojave personale</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Përmbajtje e Ndaluar:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Përmbajtje që përmban urrejtje ose diskriminim</li>
        <li>Spam ose reklamim i pakërkuar</li>
        <li>Përmbajtje e dhunshme ose e dëmshme</li>
        <li>Shkelje e të drejtave të autorit</li>
        <li>Informacione të rreme ose mashtrimi</li>
      </ul>
    `
  },
  {
    id: 'privacy',
    title: 'Privatësia',
    icon: Shield,
    content: `
      <h3 class="text-xl font-semibull text-red-500 mb-4">Privatësia dhe Të Dhënat</h3>
      <p class="mb-4">Ne respektojmë privatësinë tuaj dhe mbrojmë të dhënat tuaja personale.</p>
      <h4 class="font-semibold text-red-400 mb-2">Mbledhja e Të Dhënave:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Mblidhim vetëm të dhënat e nevojshme për shërbimin</li>
        <li>Informacionet personale mbrohen me kriptim</li>
        <li>Nuk i shesim të dhënat tuaja palëve të treta</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Të Drejtat Tuaja:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Mund të kërkoni kopje të të dhënave tuaja</li>
        <li>Mund të kërkoni fshirjen e llogarisë</li>
        <li>Mund të ndryshoni cilësimet e privatësisë</li>
      </ul>
    `
  },
  {
    id: 'rules',
    title: 'Rregullat e Komunitetit',
    icon: Globe,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Rregullat e Komunitetit</h3>
      <p class="mb-4">Shqipet është një komunitet i hapur që mbështet respektin dhe mirëkuptimin e ndërsjellët.</p>
      <h4 class="font-semibold text-red-400 mb-2">Sjellja e Pranueshme:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Trajtoni të tjerët me respekt</li>
        <li>Jini të sincertë dhe autentik</li>
        <li>Ndihmoni në krijimin e një mjedisi pozitiv</li>
        <li>Respektoni mendime të ndryshme</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Sjellja e Ndaluar:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Ngacmimi ose intimidimi</li>
        <li>Diskriminimi bazuar në gjini, racë, ose fe</li>
        <li>Shpërndarja e informacioneve private të tjerëve</li>
        <li>Krijimi i llogarive të shumta për mashtrimin</li>
      </ul>
    `
  },
  {
    id: 'violations',
    title: 'Shkeljet dhe Ndëshkimet',
    icon: AlertTriangle,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Shkeljet dhe Pasojat</h3>
      <p class="mb-4">Shkelja e kushteve mund të rezultojë në masa të ndryshme disciplinare.</p>
      <h4 class="font-semibold text-red-400 mb-2">Nivelet e Ndëshkimit:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li><strong>Paralajmërim:</strong> Për shkelje të vogla</li>
        <li><strong>Kufizim i përkohshëm:</strong> Për shkelje të përsëritura</li>
        <li><strong>Pezullim:</strong> Për shkelje serioze</li>
        <li><strong>Fshirje e llogarisë:</strong> Për shkelje të rënda</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Procesi i Ankesave:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Mund të ankoheni për vendime të marra</li>
        <li>Çdo ankesë do të shqyrtohet brenda 48 orësh</li>
        <li>Vendimi final do t'ju njoftohet me email</li>
      </ul>
    `
  },
  {
    id: 'legal',
    title: 'Aspekte Ligjorë',
    icon: Scale,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Aspekte Ligjorë</h3>
      <p class="mb-4">Këto kushte rregullohen nga ligjet e Republikës së Shqipërisë.</p>
      <h4 class="font-semibold text-red-400 mb-2">Përgjegjësia:</h4>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li>Shqipet nuk është përgjegjës për përmbajtjen e përdoruesve</li>
        <li>Përdoruesit janë përgjegjës për veprimet e tyre</li>
        <li>Platformë nuk garanton disponueshmërinë 100%</li>
      </ul>
      <h4 class="font-semibold text-red-400 mb-2">Zgjidhja e Konflikteve:</h4>
      <ul class="list-disc list-inside space-y-1">
        <li>Çdo mosmarrëveshje do të zgjidhet me dialog</li>
        <li>Nëse nuk arrihet marrëveshje, çështja do të shkojë në gjykatë</li>
        <li>Gjykatat e Tiranës kanë juridiksion për të gjitha mosmarrëveshjet</li>
      </ul>
    `
  },
  {
    id: 'contact',
    title: 'Kontakti',
    icon: Phone,
    content: `
      <h3 class="text-xl font-semibold text-red-500 mb-4">Informacione Kontakti</h3>
      <p class="mb-4">Për pyetje apo shqetësime lidhur me këto kushte, mund të na kontaktoni:</p>
      <div class="bg-red-50 p-4 rounded-lg">
        <h4 class="font-semibold text-red-400 mb-2">Shqipet Sh.p.k</h4>
        <p class="mb-2"><strong>Adresa:</strong> Rruga "Dëshmorët e Kombit", Tiranë, Shqipëri</p>
        <p class="mb-2"><strong>Email:</strong> info@shqipet.com</p>
        <p class="mb-2"><strong>Telefon:</strong> +355 4 123 4567</p>
        <p class="mb-2"><strong>Orari:</strong> E Hënë - E Premte, 09:00 - 17:00</p>
      </div>
      <p class="mt-4 text-sm text-gray-600">
        Këto kushte janë përditësuar për herë të fundit më: <strong>25 Dhjetor 2024</strong>
      </p>
    `
  }
];

const TermsOfUse = () => {
  const [activeSection, setActiveSection] = React.useState('overview');

  const currentSection = termsData.find(section => section.id === activeSection);

  // Security fix: Replace dangerouslySetInnerHTML with safe content rendering
  const renderSafeContent = (htmlContent: string) => {
    // Parse HTML safely by creating elements programmatically
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const convertElementToReact = (element: Element): React.ReactNode => {
      const tagName = element.tagName.toLowerCase();
      const children = Array.from(element.childNodes).map((child, index) => {
        if (child.nodeType === Node.TEXT_NODE) {
          return child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          return convertElementToReact(child as Element);
        }
        return null;
      });
      
      const className = element.getAttribute('class') || '';
      
      switch (tagName) {
        case 'h3':
          return <h3 key={Math.random()} className={className}>{children}</h3>;
        case 'h4':
          return <h4 key={Math.random()} className={className}>{children}</h4>;
        case 'p':
          return <p key={Math.random()} className={className}>{children}</p>;
        case 'ul':
          return <ul key={Math.random()} className={className}>{children}</ul>;
        case 'li':
          return <li key={Math.random()} className={className}>{children}</li>;
        case 'strong':
          return <strong key={Math.random()}>{children}</strong>;
        case 'div':
          return <div key={Math.random()} className={className}>{children}</div>;
        default:
          return <span key={Math.random()} className={className}>{children}</span>;
      }
    };
    
    return Array.from(doc.body.children).map((element, index) => 
      React.cloneElement(convertElementToReact(element) as React.ReactElement, { key: index })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar className="w-64 bg-white border-r border-gray-200">
            <SidebarHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Scale className="w-6 h-6 text-red-500" />
                <h1 className="text-lg font-bold text-red-500">Kushtet e Përdorimit</h1>
              </div>
              <SidebarTrigger className="md:hidden" />
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu className="p-2">
                {termsData.map((section) => (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full justify-start gap-3 p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8">
                {currentSection && (
                  <div className="prose prose-red max-w-none">
                    {renderSafeContent(currentSection.content)}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TermsOfUse;
