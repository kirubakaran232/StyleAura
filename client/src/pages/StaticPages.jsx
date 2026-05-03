import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiHeart,
  FiMail,
  FiMessageCircle,
  FiShoppingBag,
  FiInstagram,
} from 'react-icons/fi';
import { SiPinterest } from 'react-icons/si';

function StaticPage({ title, description, children }) {
  return (
    <>
      <Helmet>
        <title>{title} - StyleAura</title>
        <meta name="description" content={description} />
      </Helmet>
      <section className="bg-gradient-to-br from-primary-50 to-rose-50 dark:from-primary-950/30 dark:to-rose-950/10 py-16 border-b border-gray-100 dark:border-neutral-800">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-2">StyleAura</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{title}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{description}</p>
          </div>
        </div>
      </section>
      <section className="section container-custom">
        <div className="prose-content max-w-3xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 md:p-10 shadow-card">
          {children}
        </div>
      </section>
    </>
  );
}

function BulletList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function About() {
  const pillars = [
    {
      title: 'Clothing ideas',
      text: 'Daily wear, party looks, seasonal outfit inspiration, and budget-friendly wardrobe finds.',
    },
    {
      title: 'Cosmetics guides',
      text: 'Simple makeup picks, skincare basics, lipstick guides, and beauty routines that feel realistic.',
    },
    {
      title: 'Value-first picks',
      text: 'Product recommendations focused on usefulness, affordability, and everyday confidence.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About StyleAura - Clothing & Cosmetics Inspiration</title>
        <meta name="description" content="Learn about StyleAura, a clothing and cosmetics blog built to make style easier, affordable, and confidence-boosting." />
      </Helmet>

      <section className="relative overflow-hidden bg-white dark:bg-neutral-950">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
            <div className="text-center lg:text-left">
              <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-3">About StyleAura</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Style made practical, beautiful, and confidence-first.
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                StyleAura helps people discover outfit ideas, skincare basics, cosmetics guides, and product picks that actually fit real lifestyles and budgets. Everything is designed to feel easy to follow and useful in everyday life.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Link to="/category/fashion" className="btn-primary">
                  Explore Fashion <FiArrowRight size={16} />
                </Link>
                <Link to="/category/beauty" className="btn-outline">
                  Explore Beauty
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-card-hover border border-gray-100 dark:border-neutral-800">
                <img
                  src="/about.png"
                  alt="StyleAura fashion and beauty editorial"
                  className="w-full h-full object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 via-primary-700/20 to-transparent" /> */}
              </div>
              <div className="absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-8 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-card p-5">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">2</p>
                    <p className="text-xs text-gray-500">Core niches</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">Weekly</p>
                    <p className="text-xs text-gray-500">Fresh picks</p>
                  </div>
                  <div>
                    <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">Value</p>
                    <p className="text-xs text-gray-500">First approach</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container-custom">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {pillars.map(({ title, text }) => (
            <div key={title} className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover">
              <FiCheckCircle className="text-primary-500 mb-4" size={24} />
              <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-custom pb-20">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary-900 via-primary-700 to-rose-500 text-white rounded-3xl p-8 md:p-12 overflow-hidden relative">
          <div className="max-w-2xl relative z-10">
            <FiHeart className="text-primary-300 mb-4" size={28} />
            <h2 className="font-display text-3xl font-bold mb-4">Our mission</h2>
            <p className="text-white/90 leading-relaxed text-lg">
              StyleAura makes clothing and cosmetics content easier to trust, easier to use, and easier to fit into real budgets. It is a growing inspiration hub for people who want practical style without the overwhelm.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function Contact() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "a01001dd-4fe3-406a-aa33-c1fdd488a47a");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    if (data.success) {
      setResult("Success!");
      event.target.reset();
    } else {
      setResult("Error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact StyleAura - Questions, Collaborations & Feedback</title>
        <meta
          name="description"
          content="Contact StyleAura for clothing and cosmetics questions, collaborations, feedback, and business inquiries."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-50 to-rose-50 dark:from-primary-950/30 dark:to-rose-950/10 py-16 border-b border-gray-100 dark:border-neutral-800">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-semibold mb-2">
              Contact StyleAura
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              We would love to hear from you.
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Send questions, collaboration ideas, feedback, or business
              inquiries. We usually respond within 24-48 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <div className="space-y-4">
            {[
              {
                icon: <FiMail size={22} />,
                title: "Email",
                text: "jkstyleaura@gmail.com",
              },
              {
                icon: <FiInstagram size={22} />,
                title: "Instagram",
                text: "@jkstyleaura — Follow us for daily outfit and beauty inspiration.",
                href: "https://www.instagram.com/jkstyleaura/",
              },
              {
                icon: <SiPinterest size={22} />,
                title: "Pinterest",
                text: "@jkstyleaura — Pin your favourite style boards and product ideas.",
                href: "https://in.pinterest.com/jkstyleaura/",
              },
              {
                icon: <FiMessageCircle size={22} />,
                title: "Collaborations",
                text: "Brand features, product reviews, and styling partnerships.",
              },
              {
                icon: <FiShoppingBag size={22} />,
                title: "Business inquiries",
                text: "Affiliate, advertising, and fashion or beauty promotions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="block bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-5 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </span>
                  <span>
                    <span className="block font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-primary-600 dark:text-primary-400 hover:underline leading-relaxed"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="block text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {item.text}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-card space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="topic">
                Topic
              </label>
              <select
                id="topic"
                name="topic"
                className="input"
                defaultValue="Question"
              >
                <option>Question</option>
                <option>Collaboration idea</option>
                <option>Feedback</option>
                <option>Business inquiry</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="input min-h-40 resize-y"
                placeholder="Tell us what you have in mind..."
                required
              />
            </div>
            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Submit <FiArrowRight size={16} />
              </button>
              {result && (
                <span className={`text-sm font-semibold ${result === 'Success!' ? 'text-primary-600' : 'text-red-500'}`}>
                  {result}
                </span>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy" description="How StyleAura collects, uses, and protects visitor information.">
      <p>At StyleAura, one of our main priorities is the privacy of our visitors. This Privacy Policy explains the types of information we collect and how we use it. By using our website, you consent to this policy.</p>

      <h2>1. Information We Collect</h2>
      <BulletList items={[
        'Personal information such as name and email when you contact us or subscribe to our newsletter',
        'Browser information such as IP address, browser type, and device details',
        'Cookies and similar tracking technologies to improve user experience',
        'Analytics data such as pages visited, time spent, and referral sources',
      ]} />

      <h2>2. How We Use Your Information</h2>
      <BulletList items={[
        'Improve website content and user experience',
        'Respond to your inquiries and feedback',
        'Understand visitor behaviour through analytics',
        'Display relevant content and personalised recommendations',
        'Track affiliate link performance for our partner programs',
      ]} />

      <h2>3. Cookies &amp; Tracking</h2>
      <p>StyleAura uses cookies to store user preferences, track website performance, and personalise your browsing experience. Cookies may also be placed by third-party affiliate or advertising partners. You can disable cookies in your browser settings, although some features may not function correctly without them.</p>

      <h2>4. Affiliate Programs &amp; Third-Party Services</h2>
      <p>We may participate in various affiliate marketing programs including <strong>Amazon, Flipkart, Myntra, Nykaa, Meesho</strong>, and others. When you click affiliate links on our site, these platforms may set their own cookies and collect data in accordance with their own privacy policies. We are not responsible for their data practices.</p>
      <p>We may also use third-party analytics tools (such as Google Analytics) and advertising networks. These services collect anonymised usage data to help us understand traffic and improve the website.</p>

      <h2>5. Affiliate Earnings Disclosure</h2>
      <p>StyleAura participates in multiple affiliate programs. We may earn a commission when you click on affiliate links and make a purchase, at no additional cost to you. This helps us keep StyleAura free and running.</p>

      <h2>6. Data Protection</h2>
      <p>We do not sell, trade, or rent your personal information to others. Any information shared with us is used solely for the purposes described in this policy.</p>

      <h2>7. Contact</h2>
      <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:jkstyleaura@gmail.com" className="text-primary-600 underline">jkstyleaura@gmail.com</a>.</p>

      <h2>8. Updates</h2>
      <p>We may update this Privacy Policy at any time. Changes will be posted on this page with a revised effective date.</p>
    </StaticPage>
  );
}

export function Disclaimer() {
  return (
    <StaticPage title="Disclaimer" description="General information and affiliate content disclaimer for StyleAura.">
      <p>All information on StyleAura is published in good faith and for general information and entertainment purposes only. We make no warranties about the completeness, accuracy, or reliability of any content on this website.</p>

      <h2>Affiliate Links</h2>
      <p>Some posts and pages on StyleAura contain affiliate links from multiple platforms including <strong>Amazon, Flipkart, Myntra, Nykaa, Meesho</strong>, and other affiliate networks. When you click these links and make a purchase, we may earn a small commission at no additional cost to you.</p>

      <h2>Product Information</h2>
      <p>We do not guarantee the accuracy of product descriptions, prices, availability, or specifications shown through affiliate links. Product details are managed by the respective retail platforms and may change without notice. Always verify pricing and product details directly on the retailer's website before purchasing.</p>

      <h2>External Websites</h2>
      <p>StyleAura contains links to external websites. We have no control over the content, privacy practices, or availability of those websites. A link to an external site does not imply endorsement of its content.</p>

      <h2>General Use</h2>
      <p>Any action you take based on information found on StyleAura is strictly at your own risk. StyleAura and its owners will not be liable for any losses or damages in connection with the use of our website.</p>
    </StaticPage>
  );
}

export function AffiliateDisclosure() {
  return (
    <StaticPage title="Affiliate Disclosure" description="How affiliate links work on StyleAura.">
      <p>
        We participate in multiple affiliate marketing programs including <strong>Amazon, Flipkart, Myntra, Nykaa, Meesho</strong>, and others. This means we may earn a commission when you click on links and make purchases, at no additional cost to you. We only recommend products that we believe provide value to our readers.
      </p>

      <h2>What Are Affiliate Links?</h2>
      <p>An affiliate link is a special URL that tracks whether a purchase was made after clicking the link. If you buy something through our link, we receive a small percentage of the sale as a commission. The price you pay remains exactly the same — you are not charged extra.</p>

      <h2>Our Commitment</h2>
      <BulletList items={[
        'We only recommend products that we genuinely believe are useful, good quality, or worth the price.',
        'Our editorial opinions are independent of any affiliate partnership.',
        'Affiliate commissions help us maintain and grow StyleAura at no cost to our readers.',
        'We clearly indicate when content contains affiliate links.',
      ]} />

      <h2>Platforms We Work With</h2>
      <BulletList items={[
        'Amazon (Amazon Associates Program)',
        'Flipkart Affiliate Program',
        'Myntra Affiliate Program',
        'Nykaa Affiliate Program',
        'Meesho Affiliate Program',
        'And other fashion and beauty affiliate networks',
      ]} />

      <h2>Questions?</h2>
      <p>If you have any questions about our affiliate relationships, please contact us at <a href="mailto:jkstyleaura@gmail.com" className="text-primary-600 underline">jkstyleaura@gmail.com</a>.</p>
    </StaticPage>
  );
}

export function TermsAndConditions() {
  return (
    <StaticPage title="Terms &amp; Conditions" description="The basic terms for accessing and using StyleAura.">
      <p>By accessing and using StyleAura, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.</p>

      <h2>1. Use of Content</h2>
      <BulletList items={[
        'Content on StyleAura is for personal, non-commercial use only.',
        'You may not copy, republish, or redistribute our content without prior written permission.',
        'You may share links to our posts on social media or personal blogs.',
        'Information on this website may change without notice.',
      ]} />

      <h2>2. Affiliate Links</h2>
      <p>StyleAura participates in multiple affiliate programs including Amazon, Flipkart, Myntra, Nykaa, Meesho, and others. Posts and pages on this website may contain affiliate links. By clicking these links, you acknowledge that:</p>
      <BulletList items={[
        'StyleAura may earn a commission if you make a purchase through an affiliate link.',
        'The price you pay is unaffected by using our affiliate links.',
        'All transactions are handled by the respective third-party platform (Amazon, Flipkart, Myntra, etc.).',
        'StyleAura is not a party to any purchase transaction made on external platforms.',
      ]} />

      <h2>3. External Platforms &amp; Liability</h2>
      <p>Purchases made through affiliate links are governed by the terms and conditions of the respective retail platform. StyleAura is not responsible for:</p>
      <BulletList items={[
        'Product quality, availability, or accuracy of information on external sites.',
        'Any disputes, refunds, or issues arising from purchases made on third-party platforms.',
        'Changes in product pricing or affiliate program terms.',
      ]} />

      <h2>4. Limitation of Liability</h2>
      <p>StyleAura and its owner(s) shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, this website or any linked external platforms.</p>

      <h2>5. Contact</h2>
      <p>For any questions regarding these Terms &amp; Conditions, please contact us at <a href="mailto:jkstyleaura@gmail.com" className="text-primary-600 underline">jkstyleaura@gmail.com</a>.</p>
    </StaticPage>
  );
}

export function Sitemap() {
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Fashion', to: '/category/fashion' },
    { label: 'Beauty', to: '/category/beauty' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Affiliate Disclosure', to: '/affiliate-disclosure' },
    { label: 'Terms & Conditions', to: '/terms-and-conditions' },
  ];

  return (
    <StaticPage title="Sitemap" description="Browse the main StyleAura pages and category sections.">
      <ul>
        {links.map(link => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}
