import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Pulse AI – Real-Time Market Sentiment",
  description: "AI-powered sentiment and pricing analytics for crypto & stocks.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-20`}
      >
        {/* Initial theme script to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const s = localStorage.getItem('mp-theme'); if (s === 'dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches)) { document.documentElement.classList.add('dark'); } } catch(_){} })();`
          }}
        />
        {children}
        {/* Hide Flowise "Powered by" badge */}
        <style>{`
          #lite-badge, .lite-badge { display: none !important; }
        `}</style>
        {/* Flowise Chatbot embed */}
        <Script id="flowise-chatbot" strategy="afterInteractive" type="module">
          {`
            import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
            const buildTheme = (isDark) => ({
              button: {
                backgroundColor: '#8e51ff',
                right: 20,
                bottom: 20,
                size: 48,
                dragAndDrop: true,
                iconColor: 'white',
                customIconSrc: '/chatbotLogo.png',
                autoWindowOpen: { autoOpen: false, openDelay: 2, autoOpenOnMobile: false }
              },
              customCSS: '.lite-badge, #lite-badge { display: none !important; visibility: hidden !important; height:0 !important; } span.w-full.text-center[class*="px-"][class*="pt-"][class*="pb-"][class*="m-auto"] { display:none !important; } .flowise-chat-window, .flowise-chatbot-window { padding-bottom: 24px !important; }',
              chatWindow: {
                showTitle: true,
                showAgentMessages: false,
                title: 'Investiq',
                titleAvatarSrc: '/chatbotLogo.png',
                welcomeMessage: 'Hello! This is Investiq. How can I assist you with market insights today?',
                errorMessage: 'If something goes wrong, please try again.',
                backgroundColor: isDark ? '#0b0b0b' : '#ffffff',
                height: 450,
                width: 400,
                fontSize: 16,
                starterPrompts: [
                  'What is Market Pulse AI?',
                  'How does Market Pulse AI work?',
                  'Who is the CEO of Market Pulse AI?'
                ],
                starterPromptFontSize: 10,
                clearChatOnReload: false,
                sourceDocsTitle: 'Sources:',
                renderHTML: true,
                botMessage: { backgroundColor: isDark ? '#121212' : '#f7f8ff', textColor: isDark ? '#e5e5e5' : '#303235', showAvatar: true, avatarSrc: '/chatbotLogo.png' },
                userMessage: { backgroundColor: '#8e51ff', textColor: '#ffffff', showAvatar: false },
                textInput: {
                  placeholder: 'Type your question',
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  textColor: isDark ? '#ffffff' : '#303235',
                  sendButtonColor: '#8e51ff',
                  autoFocus: true,
                  sendMessageSound: false,
                  receiveMessageSound: false
                },
                footer: false
              }
            });

            const initChatbot = (isDark) => {
              Chatbot.init({
                chatflowid: 'd117bb6a-dadf-4421-8030-4a3450db41b9',
                apiHost: 'https://cloud.flowiseai.com',
                chatflowConfig: { showProcessFlow: false },
                observersConfig: {},
                theme: buildTheme(isDark)
              });
            };

            const isDark = document.documentElement.classList.contains('dark');
            initChatbot(isDark);

            const obs = new MutationObserver(() => {
              const nowDark = document.documentElement.classList.contains('dark');
              initChatbot(nowDark);
            });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
          `}
        </Script>
      </body>
    </html>
  );
}
