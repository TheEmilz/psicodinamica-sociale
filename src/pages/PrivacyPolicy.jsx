import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Indirizzo email di contatto per le richieste privacy / esercizio diritti GDPR.
// Cambia qui se in futuro usi una casella diversa.
const CONTACT_EMAIL = 'silviaisid@gmail.com'

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Informativa Privacy · Psicodinamica Sociale'
    return () => { document.title = 'Psicodinamica Sociale' }
  }, [])

  const h2 = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.6rem',
    fontWeight: 500,
    color: '#2f2f2f',
    margin: '36px 0 12px',
  }
  const p = { fontSize: '15px', lineHeight: 1.8, color: '#4b5563', margin: '0 0 12px' }
  const li = { fontSize: '15px', lineHeight: 1.8, color: '#4b5563', marginBottom: '6px' }
  const link = { color: '#5b4de0', textDecoration: 'underline' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header back link */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 40px', background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(91,77,224,0.1)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5b4de0', textDecoration: 'none' }}
        >
          ← Home
        </Link>
        <span style={{ width: '1px', height: '16px', background: 'rgba(91,77,224,0.2)' }} />
        <span style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#9ca3af', textTransform: 'uppercase' }}>
          Informativa Privacy
        </span>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 100px' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#5b4de0', marginBottom: '16px' }}
        >
          GDPR · Reg. UE 2016/679
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 500, lineHeight: 1.15, color: '#2f2f2f', marginBottom: '8px' }}
        >
          Informativa sulla Privacy
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
          style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '40px' }}
        >
          Ultimo aggiornamento: giugno 2026
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p style={p}>
            La presente informativa descrive le modalità di trattamento dei dati personali
            degli utenti che consultano il sito <strong>Psicodinamica Sociale</strong> e che
            utilizzano i moduli di contatto e candidatura messi a disposizione. Il trattamento
            avviene nel rispetto del Regolamento (UE) 2016/679 («GDPR») e della normativa
            italiana vigente in materia di protezione dei dati personali.
          </p>

          <h2 style={h2}>1. Titolare del trattamento</h2>
          <p style={p}>
            Il Titolare del trattamento è il responsabile del progetto Psicodinamica Sociale.
            Per qualsiasi richiesta relativa ai dati personali è possibile scrivere a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={link}>{CONTACT_EMAIL}</a>.
          </p>

          <h2 style={h2}>2. Tipologie di dati trattati</h2>
          <p style={p}>Attraverso i moduli presenti nel sito possono essere raccolti:</p>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px' }}>
            <li style={li}>dati anagrafici e di contatto (nome, cognome, indirizzo email, eventuale numero di telefono);</li>
            <li style={li}>il contenuto del messaggio o della candidatura che l'utente decide liberamente di inviare;</li>
            <li style={li}>dati di navigazione tecnici, gestiti dall'infrastruttura di hosting per il solo funzionamento e la sicurezza del sito.</li>
          </ul>
          <p style={p}>
            Si invita l'utente a <strong>non inserire dati sanitari o categorie particolari di
            dati</strong> (art. 9 GDPR) all'interno dei messaggi di primo contatto: per tali
            informazioni si procederà in un secondo momento, nell'ambito della relazione
            terapeutica e con apposita informativa dedicata.
          </p>

          <h2 style={h2}>3. Finalità e base giuridica</h2>
          <ul style={{ paddingLeft: '20px', margin: '0 0 12px' }}>
            <li style={li}>rispondere alle richieste di informazioni e di appuntamento (base giuridica: consenso e misure precontrattuali, art. 6.1 lett. a e b GDPR);</li>
            <li style={li}>gestire le candidature professionali ricevute (base giuridica: consenso dell'interessato);</li>
            <li style={li}>garantire la sicurezza e il corretto funzionamento del sito (base giuridica: legittimo interesse, art. 6.1 lett. f GDPR).</li>
          </ul>

          <h2 style={h2}>4. Modalità del trattamento</h2>
          <p style={p}>
            L'invio dei moduli apre il client di posta dell'utente e recapita il messaggio
            direttamente alla casella email del Titolare: i dati non transitano da database del
            sito. Il trattamento avviene con strumenti elettronici e con misure tecniche e
            organizzative adeguate a garantire riservatezza, integrità e protezione dei dati da
            accessi non autorizzati.
          </p>

          <h2 style={h2}>5. Cookie e servizi di terze parti</h2>
          <p style={p}>
            Il sito <strong>non utilizza cookie di profilazione</strong> né strumenti di
            tracciamento pubblicitario. Per la resa tipografica vengono caricati i font da Google
            Fonts: tale servizio può comportare la comunicazione dell'indirizzo IP dell'utente ai
            server di Google LLC al solo scopo di erogare i caratteri. Non vengono impostati
            cookie a fini di marketing.
          </p>

          <h2 style={h2}>6. Conservazione dei dati</h2>
          <p style={p}>
            I dati di contatto e le candidature sono conservati per il tempo strettamente
            necessario a gestire la richiesta e, successivamente, per il periodo previsto da
            eventuali obblighi di legge. Le candidature non selezionate vengono cancellate quando
            non più utili alle finalità per cui sono state raccolte.
          </p>

          <h2 style={h2}>7. Diritti dell'interessato</h2>
          <p style={p}>
            In qualità di interessato, l'utente può in ogni momento esercitare i diritti previsti
            dagli articoli 15-22 del GDPR: accesso, rettifica, cancellazione, limitazione,
            portabilità, opposizione al trattamento e revoca del consenso. Per esercitare tali
            diritti è sufficiente scrivere a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={link}>{CONTACT_EMAIL}</a>. L'interessato ha
            inoltre il diritto di proporre reclamo all'Autorità Garante per la protezione dei dati
            personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={link}>www.garanteprivacy.it</a>).
          </p>

          <h2 style={h2}>8. Modifiche all'informativa</h2>
          <p style={p}>
            La presente informativa può essere aggiornata nel tempo per adeguarla a modifiche
            normative o organizzative. Le eventuali variazioni saranno pubblicate in questa
            pagina con l'indicazione della data di ultimo aggiornamento.
          </p>

          <div style={{ marginTop: '48px', paddingTop: '28px', borderTop: '1px solid rgba(91,77,224,0.18)' }}>
            <Link
              to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#5b4de0', textDecoration: 'none' }}
            >
              ← Torna alla home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
