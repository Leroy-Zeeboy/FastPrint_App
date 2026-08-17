import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { getTarifs } from '../api/tarifService';
import { getCatalogue } from '../api/accessoireService';

const BASE_FICHIERS = import.meta.env.VITE_FILES_URL || `http://localhost:8080`;

export default function Home() {
  const { user } = useAuth();
  const [tarifs, setTarifs] = useState([]);
  const [accessoires, setAccessoires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [resTarifs, resAccessoires] = await Promise.all([
          getTarifs(),
          getCatalogue(),
        ]);
        setTarifs(resTarifs.data.data || []);
        setAccessoires(resAccessoires.data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      } finally {
        setLoading(false);
      }
    };
    chargerDonnees();
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/connexion';
    if (user.role === 'administrateur') return '/admin';
    if (user.role === 'gerant') return '/gerant';
    return '/client';
  };

  const formatTypeImpression = (type) => {
    if (type === 'noir_et_blanc') return 'Noir & Blanc';
    if (type === 'couleur') return 'Couleur';
    return type;
  };

  const formatDisposition = (disp) => {
    if (disp === 'recto_simple') return 'Recto simple';
    if (disp === 'recto_verso') return 'Recto-verso';
    return disp;
  };

  const fonctionnalites = [
    {
      emoji: '🖨️',
      titre: 'Dépôt de documents',
      description: 'Déposez vos fichiers PDF ou Word depuis n\'importe où. Choisissez vos options d\'impression et de finition en quelques clics.',
      couleur: 'from-blue-500 to-blue-600',
    },
    {
      emoji: '💰',
      titre: 'Tarification automatique',
      description: 'Le montant est calculé automatiquement selon le nombre de pages, le type d\'impression et les options choisies. Zéro surprise.',
      couleur: 'from-green-500 to-green-600',
    },
    {
      emoji: '🔔',
      titre: 'Notifications temps réel',
      description: 'Recevez une notification dès que votre document est prêt à être récupéré ou en cas de problème avec votre fichier.',
      couleur: 'from-purple-500 to-purple-600',
    },
    {
      emoji: '📦',
      titre: 'Options de finition',
      description: 'Couverture rigide, reliure spirale ou cerneau, première page cartonnée — personnalisez votre document comme vous le souhaitez.',
      couleur: 'from-orange-500 to-orange-600',
    },
    {
      emoji: '🛒',
      titre: 'Boutique fournitures',
      description: 'Achetez vos fournitures scolaires directement dans l\'app. Stylos, cahiers, clés USB — tout en un seul endroit.',
      couleur: 'from-pink-500 to-pink-600',
    },
    {
      emoji: '🔒',
      titre: 'Sécurité des documents',
      description: 'Vos documents sensibles sont automatiquement supprimés après impression. Votre confidentialité est garantie.',
      couleur: 'from-red-500 to-red-600',
    },
  ];

  const etapes = [
    { numero: '01', titre: 'Créez votre compte', description: 'Inscription gratuite en moins d\'une minute.' },
    { numero: '02', titre: 'Déposez votre document', description: 'Choisissez vos options d\'impression et de finition.' },
    { numero: '03', titre: 'On s\'occupe du reste', description: 'Le gérant traite votre commande et vous notifie.' },
    { numero: '04', titre: 'Récupérez votre document', description: 'Venez chercher votre document imprimé sur place.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo officiel FastPrint */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/LogoFP.png" 
              alt="Logo FastPrint" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/180x50/0052FF/FFFFFF?text=FastPrint';
              }}
            />
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#fonctionnalites" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              Tarifs
            </a>
            <a href="#accessoires" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              Fournitures
            </a>
            <a href="#comment-ca-marche" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              Comment ça marche
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary text-sm font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Boutons auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Bonjour, <strong>{user.prenom}</strong> 👋
                </span>
                <Link to={getDashboardLink()} className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md">
                  Mon espace →
                </Link>
              </>
            ) : (
              <>
                <Link to="/connexion" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors px-4 py-2">
                  Se connecter
                </Link>
                <Link to="/inscription" className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-md">
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden text-gray-600 font-bold text-xl"
            onClick={() => setMenuOuvert(!menuOuvert)}
          >
            {menuOuvert ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOuvert && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
            <a href="#fonctionnalites" className="text-gray-600 text-sm" onClick={() => setMenuOuvert(false)}>Fonctionnalités</a>
            <a href="#tarifs" className="text-gray-600 text-sm" onClick={() => setMenuOuvert(false)}>Tarifs</a>
            <a href="#accessoires" className="text-gray-600 text-sm" onClick={() => setMenuOuvert(false)}>Fournitures</a>
            <a href="#comment-ca-marche" className="text-gray-600 text-sm" onClick={() => setMenuOuvert(false)}>Comment ça marche</a>
            <a href="#contact" className="text-gray-600 text-sm" onClick={() => setMenuOuvert(false)}>Contact</a>
            <hr />
            {user ? (
              <Link to={getDashboardLink()} className="bg-primary text-white text-center py-2 rounded-lg text-sm font-semibold">
                Mon espace
              </Link>
            ) : (
              <>
                <Link to="/connexion" className="text-gray-700 text-sm text-center py-2">
                  Se connecter
                </Link>
                <Link to="/inscription" className="bg-primary text-white text-center py-2 rounded-lg text-sm font-semibold">
                  S'inscrire gratuitement
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* HERO SECTION RESPONSIVE */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 relative overflow-hidden text-white bg-slate-950 min-h-[80vh] md:min-h-[85vh] flex items-center">
        
        <div 
          className="absolute inset-0 bg-cover bg-top md:bg-[center_top] bg-no-repeat opacity-40 md:opacity-100 transition-opacity duration-300"
          style={{ backgroundImage: `url('/image.jpg')` }}
        ></div>

        <div className="absolute inset-0 bg-slate-950/80 md:bg-transparent md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/90 md:to-transparent md:w-3/4"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Politique &amp; Gestion d'impression optimisée
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight uppercase">
              IMPRIMEZ SANS <br />
              <span className="text-amber-400">VOUS DÉPLACER</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Déposez vos documents depuis votre téléphone, choisissez vos options
              de finition et recevez une notification quand c'est prêt.
              Simple, rapide, sécurisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to={getDashboardLink()} className="bg-white text-slate-900 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition shadow-xl text-center">
                  Accéder à mon espace →
                </Link>
              ) : (
                <>
                  <Link to="/inscription" className="bg-white text-slate-900 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 transition shadow-xl text-center">
                    Commencer gratuitement →
                  </Link>
                  <Link to="/connexion" className="border-2 border-white/50 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/10 transition backdrop-blur text-center">
                    Se connecter
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-md">
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">100%</p>
                <p className="text-gray-400 text-xs sm:text-sm">En ligne</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">24h</p>
                <p className="text-gray-400 text-xs sm:text-sm">Délai moyen</p>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black text-white">🔒</p>
                <p className="text-gray-400 text-xs sm:text-sm">Sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
              Fonctionnalités
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Une plateforme complète pour gérer vos impressions et vos fournitures scolaires.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fonctionnalites.map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.couleur} rounded-2xl flex items-center justify-center mb-5 text-2xl shadow-md`}>
                  {f.emoji}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {f.titre}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
              Processus
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {etapes.map((etape, i) => (
              <div key={i} className="text-center relative">
                {i < etapes.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary to-gray-200"></div>
                )}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10">
                  <span className="text-white font-black text-lg">
                    {etape.numero}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{etape.titre}</h3>
                <p className="text-gray-500 text-sm">{etape.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
              Tarification
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Des prix transparents
            </h2>
            <p className="text-gray-500 mt-4">
              Prix par page, hors options de finition. Calculé automatiquement.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tarifs.map((tarif) => (
                <div key={tarif.idTarif} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-secondary hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl">
                    {tarif.typeImpression === 'noir_et_blanc' ? '⬛' : '🎨'}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {formatTypeImpression(tarif.typeImpression)}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {formatDisposition(tarif.disposition)}
                  </p>
                  <div className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                    <span className="text-4xl font-black">
                      {tarif.prixUnitaire}
                    </span>
                    <span className="text-sm font-medium"> FCFA/page</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
            <p className="text-blue-700 text-sm">
              💡 <strong>Forfaits de finition disponibles</strong> —
              Plastification + carton + reliure à partir de 300 FCFA
              (selon le nombre de pages). Options premium disponibles.
            </p>
          </div>
        </div>
      </section>

      {/* ACCESSOIRES */}
      {accessoires.length > 0 && (
        <section id="accessoires" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
                Boutique
              </span>
              <h2 className="text-4xl font-black text-gray-900 mt-2">
                Nos fournitures scolaires
              </h2>
              <p className="text-gray-500 mt-4">
                {user
                  ? 'Commandez directement depuis votre espace.'
                  : 'Inscrivez-nous pour commander en ligne.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {accessoires.slice(0, 8).map((accessoire) => (
                <div key={accessoire.idAccessoire} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mb-4 text-2xl overflow-hidden">
                    {accessoire.imageUrl ? (
                      <img
                        src={accessoire.imageUrl?.startsWith('http') ? accessoire.imageUrl : BASE_FICHIERS + accessoire.imageUrl}
                        alt={accessoire.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {accessoire.nom}
                  </h3>
                  {accessoire.description && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                      {accessoire.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-secondary text-lg">
                      {accessoire.prix} FCFA
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      accessoire.quantiteStock > 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {accessoire.quantiteStock > 0
                        ? `${accessoire.quantiteStock} en stock`
                        : 'Rupture'}
                    </span>
                  </div>
                  {!user ? (
                    <Link to="/inscription" className="block text-center bg-gradient-to-r from-primary to-secondary text-white text-xs py-2.5 rounded-xl hover:opacity-90 transition font-semibold">
                      Commander →
                    </Link>
                  ) : (
                    <Link to="/client" className="block text-center bg-gradient-to-r from-primary to-secondary text-white text-xs py-2.5 rounded-xl hover:opacity-90 transition font-semibold">
                      Ajouter au panier →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NOURVELLE SECTION CONTACT & INFORMATIONS */}
      <section id="contact" className="py-24 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
              Contact & Accès
            </span>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              Où nous trouver ?
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Retrouvez nos coordonnées et notre localisation pour venir récupérer vos travaux d'impression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Téléphone */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                📞
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Téléphone / WhatsApp</h3>
              <p className="text-gray-600 text-sm mb-4">Notre équipe est disponible pour répondre à vos questions.</p>
              <a href="tel:+237600000000" className="text-primary font-bold hover:underline">
                <tr>+237 686-388-948</tr><br />
                <tr>+237 693-529-925</tr><br />
                <tr>+237 655-543-443</tr>
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                ✉️
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Adresse E-mail</h3>
              <p className="text-gray-600 text-sm mb-4">Envoyez-nous vos requêtes spécifiques par courriel.</p>
              <a href="mailto:contact@fastprint.cm" className="text-primary font-bold hover:underline">
                djaoweleroy88@gmail.com
              </a>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                📍
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Notre Localisation</h3>
              <p className="text-gray-600 text-sm mb-4">Point de retrait principal pour vos impressions physiques.</p>
              <span className="text-gray-800 font-semibold text-sm">
                Ambam, Sud-Cameroun
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      {!user && (
        <section className="py-24 px-6 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-5xl font-black mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Rejoignez FastPrint et simplifiez vos impressions dès aujourd'hui.
              Inscription gratuite, sans engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/inscription" className="bg-white text-slate-900 px-10 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition shadow-2xl">
                Créer mon compte gratuitement →
              </Link>
              <Link to="/connexion" className="border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition backdrop-blur">
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-950 text-gray-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/LogoFP.png" 
                alt="Logo FastPrint" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/180x50/0052FF/FFFFFF?text=FastPrint';
                }}
              />
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#fonctionnalites" className="hover:text-white transition">
                Fonctionnalités
              </a>
              <a href="#tarifs" className="hover:text-white transition">
                Tarifs
              </a>
              <a href="#accessoires" className="hover:text-white transition">
                Fournitures
              </a>
              <a href="#contact" className="hover:text-white transition">
                Contact
              </a>
            </div>
            <p className="text-sm">© 2026 FastPrint. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}