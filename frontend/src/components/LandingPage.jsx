import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SunIcon, LightningIcon, LeafIcon, DollarIcon, CpuIcon, HomeIcon, DocumentIcon, SaveIcon, RefreshIcon } from '../assets/icons'

export default function LandingPage() {
  const [currentStat, setCurrentStat] = useState(0)
  const [animatedStats, setAnimatedStats] = useState({
    savings: 0,
    time: 0,
    bills: 0
  })

  // Animated counter effect for statistics
  useEffect(() => {
    const timers = []
    
    // Animate savings counter
    const savingsTarget = 2500
    const savingsTimer = setInterval(() => {
      setAnimatedStats(prev => ({
        ...prev,
        savings: prev.savings < savingsTarget ? prev.savings + 50 : savingsTarget
      }))
    }, 20)
    timers.push(savingsTimer)

    // Animate time counter - changed to 120 seconds (2 minutes)
    const timeTarget = 120
    const timeTimer = setInterval(() => {
      setAnimatedStats(prev => ({
        ...prev,
        time: prev.time < timeTarget ? prev.time + 2 : timeTarget
      }))
    }, 50)
    timers.push(timeTimer)

    // Animate bills counter
    const billsTarget = 10000
    const billsTimer = setInterval(() => {
      setAnimatedStats(prev => ({
        ...prev,
        bills: prev.bills < billsTarget ? prev.bills + 200 : billsTarget
      }))
    }, 30)
    timers.push(billsTimer)

    // Cleanup
    return () => timers.forEach(timer => clearInterval(timer))
  }, [])

  // Rotating statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat(prev => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing-page-enhanced">
      {/* Enhanced Header */}
      <header className="header-enhanced">
        <div className="header-content-enhanced">
          <div className="logo-enhanced">
            <div className="logo-icon">
              <SunIcon size={32} />
            </div>
            <span>BEDA SOLAR</span>
          </div>
          <nav className="nav-enhanced">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#testimonials" className="nav-link">Reviews</a>
            <div className="nav-cta">
              <Link to="/app" className="btn btn-primary">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Revolutionary Hero Section */}
      <section className="hero-enhanced">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
          <div className="floating-elements">
            <div className="float-icon float-1">
              <SunIcon size={24} />
            </div>
            <div className="float-icon float-2">
              <LightningIcon size={20} />
            </div>
            <div className="float-icon float-3">
              <LeafIcon size={22} />
            </div>
          </div>
        </div>

        <div className="hero-content-enhanced">
          <div className="hero-main">
            <div className="trust-indicators">
              <div className="trust-badge">
                <span className="trust-icon">BEST</span>
                <span>Australia's #1 Solar Calculator</span>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">TRUSTED</span>
                <span>10,000+ Happy Customers</span>
              </div>
            </div>

            <h1 className="hero-title-enhanced">
              Transform Your 
              <span className="highlight-enhanced"> Electricity Bill </span>
              Into Solar Savings
            </h1>
            
            <p className="hero-subtitle-enhanced">
              Upload your bill and get a personalized solar proposal in under 2 minutes. 
              Powered by advanced AI and trusted by 10,000+ Australians.
            </p>

            <div className="hero-features-preview">
              <div className="feature-preview">
                <LightningIcon size={16} />
                <span>Quick Analysis</span>
              </div>
              <div className="feature-preview">
                <CpuIcon size={16} />
                <span>99.8% Accuracy</span>
              </div>
              <div className="feature-preview">
                <SaveIcon size={16} />
                <span>Free Forever</span>
              </div>
            </div>

            <div className="hero-actions-enhanced">
              <Link to="/app" className="btn btn-primary btn-lg">
                <DocumentIcon size={20} />
                <span>Analyze My Bill</span>
              </Link>
              <button className="btn btn-secondary btn-lg">
                <LightningIcon size={20} />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="calculator-preview">
              <div className="calculator-header">
                <div className="calc-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="calc-title">Solar Calculator</span>
              </div>
              <div className="calculator-content">
                <div className="calc-input">
                  <DocumentIcon size={24} />
                  <span>Upload your electricity bill</span>
                </div>
                <div className="calc-arrow">↓</div>
                <div className="calc-result">
                  <div className="result-item">
                    <span className="result-label">Monthly Savings</span>
                    <span className="result-value animate-counter">${animatedStats.savings}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Analysis Time</span>
                    <span className="result-value animate-counter">{animatedStats.time}s</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">CO₂ Reduced</span>
                    <span className="result-value animate-counter">{Math.round(animatedStats.bills/100)}kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="stats-carousel">
              <div className={`stat-slide ${currentStat === 0 ? 'active' : ''}`}>
                <span className="stat-number">${animatedStats.savings.toLocaleString()}</span>
                <span className="stat-label">Average Annual Savings</span>
              </div>
              <div className={`stat-slide ${currentStat === 1 ? 'active' : ''}`}>
                <span className="stat-number">2 min</span>
                <span className="stat-label">Quick Analysis Time</span>
              </div>
              <div className={`stat-slide ${currentStat === 2 ? 'active' : ''}`}>
                <span className="stat-number">{animatedStats.bills.toLocaleString()}+</span>
                <span className="stat-label">Bills Successfully Analyzed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="features-enhanced">
        <div className="features-background">
          <div className="feature-pattern"></div>
        </div>
        
        <div className="section-header-enhanced">
          <div className="section-badge">
            <LightningIcon size={16} />
            <span>Why Choose Us</span>
          </div>
          <h2>The Most Advanced Solar Calculator in Australia</h2>
          <p>Cutting-edge AI technology meets solar expertise to deliver unmatched accuracy and insights</p>
        </div>

        <div className="features-grid-enhanced">
          <div className="feature-card-enhanced">
            <div className="feature-icon-enhanced">
              <CpuIcon size={40} />
            </div>
            <h3>AI-Powered Precision</h3>
            <p>Our proprietary AI reads any electricity bill format with 99.8% accuracy, extracting every detail to maximize your savings potential.</p>
            <div className="feature-stats">
              <span>99.8% Accuracy</span>
              <span>200+ Bill Formats</span>
            </div>
          </div>

          <div className="feature-card-enhanced highlight">
            <div className="feature-badge">Most Popular</div>
            <div className="feature-icon-enhanced">
              <LightningIcon size={40} />
            </div>
            <h3>Quick Results</h3>
            <p>Get your personalized solar proposal in under 2 minutes. No forms, no waiting, no sales calls required.</p>
            <div className="feature-stats">
              <span>2 Minutes</span>
              <span>Zero Hassle</span>
            </div>
          </div>

          <div className="feature-card-enhanced">
            <div className="feature-icon-enhanced">
              <LeafIcon size={40} />
            </div>
            <h3>Environmental Impact</h3>
            <p>See exactly how much CO₂ you'll save and your contribution to Australia's clean energy future.</p>
            <div className="feature-stats">
              <span>Carbon Tracking</span>
              <span>Impact Metrics</span>
            </div>
          </div>

          <div className="feature-card-enhanced">
            <div className="feature-icon-enhanced">
              <DollarIcon size={40} />
            </div>
            <h3>Real Savings Analysis</h3>
            <p>Accurate financial projections based on your actual usage patterns, location, and roof specifications.</p>
            <div className="feature-stats">
              <span>Personalized</span>
              <span>Location-Based</span>
            </div>
          </div>
        </div>

        <div className="features-guarantee">
          <div className="guarantee-content">
            <h3>100% Free Analysis Guarantee</h3>
            <p>Complete solar analysis with no hidden fees, no credit card required, and no obligation to purchase.</p>
            <div className="guarantee-features">
              <span>No Credit Card Required</span>
              <span>No Sales Calls</span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modern How It Works */}
      <section id="how-it-works" className="how-it-works-enhanced">
        <div className="section-header-enhanced">
          <div className="section-badge">
            <LightningIcon size={16} />
            <span>Simple Process</span>
          </div>
          <h2>From Bill to Solar Proposal in 3 Easy Steps</h2>
          <p>Our streamlined process gets you solar-ready in minutes, not weeks</p>
        </div>

        <div className="steps-container-enhanced">
          <div className="steps-timeline">
            <div className="step-card">
              <div className="time-indicator">30 sec</div>
              <div className="step-header">
                <div className="step-number-modern">1</div>
                <div className="step-icon-modern">
                  <DocumentIcon size={32} />
                </div>
              </div>
              <h3 className="step-title">Upload Your Bill</h3>
              <p className="step-description">Drop your electricity bill and watch our AI instantly extract every detail with 99.8% accuracy.</p>
              <div className="step-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Instant AI recognition</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>All formats supported</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Secure & encrypted</span>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="time-indicator">60 sec</div>
              <div className="step-header">
                <div className="step-number-modern">2</div>
                <div className="step-icon-modern">
                  <CpuIcon size={32} />
                </div>
              </div>
              <h3 className="step-title">Smart Analysis</h3>
              <p className="step-description">Advanced AI analyzes your usage patterns and maps your roof via satellite for optimal solar design.</p>
              <div className="step-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Satellite roof mapping</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Usage optimization</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Custom system sizing</span>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="time-indicator">30 sec</div>
              <div className="step-header">
                <div className="step-number-modern">3</div>
                <div className="step-icon-modern">
                  <SaveIcon size={32} />
                </div>
              </div>
              <h3 className="step-title">Get Your Proposal</h3>
              <p className="step-description">Receive a comprehensive solar proposal with precise savings, ROI, and environmental impact data.</p>
              <div className="step-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Detailed savings report</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>System specifications</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon"></div>
                  <span>Instant download</span>
                </div>
              </div>
            </div>
          </div>

          <div className="process-summary">
            <div className="summary-header">
              <h3 className="summary-title">Why 10,000+ Australians Choose Our Process</h3>
              <p className="summary-subtitle">Fast, accurate, and completely transparent solar analysis</p>
            </div>
            
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">2 min</span>
                <span className="stat-label">Average completion time</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">Analysis accuracy</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10k+</span>
                <span className="stat-label">Happy customers</span>
              </div>
            </div>

            <div className="guarantee-modern">
              <h4>Lightning-Fast Guarantee</h4>
              <p>Complete analysis in under 2 minutes, or we'll provide personalized savings recommendations from our solar experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="testimonials" className="testimonials-enhanced">
        <div className="section-header-enhanced">
          <div className="section-badge">
            <span>5 Stars</span>
            <span>Customer Reviews</span>
          </div>
          <h2>Join 10,000+ Happy Australians</h2>
          <p>Real stories from real customers who transformed their energy bills</p>
        </div>

        <div className="testimonials-grid-enhanced">
          <div className="testimonial-card-enhanced featured">
            <div className="testimonial-header">
              <div className="customer-avatar">
                <span>SM</span>
              </div>
              <div className="customer-info">
                <strong>Sarah Mitchell</strong>
                <span>Melbourne, VIC</span>
                <div className="rating">5/5 Stars</div>
              </div>
            </div>
            <blockquote>
              "Incredible accuracy! The analysis was spot-on and I'm now saving $247 every month. The whole process took just 90 seconds."
            </blockquote>
            <div className="testimonial-stats">
              <div className="stat">
                <strong>$247/mo</strong>
                <span>Monthly Savings</span>
              </div>
              <div className="stat">
                <strong>90s</strong>
                <span>Analysis Time</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card-enhanced">
            <div className="testimonial-header">
              <div className="customer-avatar">
                <span>DL</span>
              </div>
              <div className="customer-info">
                <strong>David Liu</strong>
                <span>Sydney, NSW</span>
                <div className="rating">5/5 Stars</div>
              </div>
            </div>
            <blockquote>
              "The AI picked up details even I missed on my bill. Saved me weeks of research and thousands in consulting fees."
            </blockquote>
            <div className="testimonial-impact">
              <span>Saved $3,200 in first year</span>
            </div>
          </div>

          <div className="testimonial-card-enhanced">
            <div className="testimonial-header">
              <div className="customer-avatar">
                <span>ER</span>
              </div>
              <div className="customer-info">
                <strong>Emma Rodriguez</strong>
                <span>Brisbane, QLD</span>
                <div className="rating">5/5 Stars</div>
              </div>
            </div>
            <blockquote>
              "Fast, transparent, and completely free. No sales pressure, just honest analysis. Exactly what I needed."
            </blockquote>
            <div className="testimonial-impact">
              <span>Reduced carbon footprint by 4.2 tons/year</span>
            </div>
          </div>
        </div>

        <div className="social-proof">
          <div className="proof-stats">
            <div className="proof-item">
              <strong>10,000+</strong>
              <span>Bills Analyzed</span>
            </div>
            <div className="proof-item">
              <strong>$2.4M+</strong>
              <span>Total Savings Generated</span>
            </div>
            <div className="proof-item">
              <strong>4.9/5</strong>
              <span>Average Rating</span>
            </div>
            <div className="proof-item">
              <strong>2 min</strong>
              <span>Average Analysis Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="cta-enhanced">
        <div className="cta-background">
          <div className="cta-gradient"></div>
          <div className="cta-pattern"></div>
        </div>
        
        <div className="cta-content-enhanced">
          <div className="cta-main">
            <h2>Ready to Start Saving with Solar?</h2>
            <p>Join 10,000+ Australians who've discovered their solar potential</p>
            
            <div className="cta-features">
              <div className="cta-feature">
                <LightningIcon size={16} />
                <span>2-minute analysis</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">FREE</span>
                <span>Completely free</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">EASY</span>
                <span>No signup required</span>
              </div>
            </div>

            <div className="cta-actions">
              <Link to="/app" className="btn btn-primary btn-xl">
                <DocumentIcon size={24} />
                <span>Start Free Analysis</span>
              </Link>
            </div>


          </div>

          <div className="cta-visual">
            <div className="success-preview">
              <div className="success-item">
                <DollarIcon size={20} />
                <span>Average $2,500/year savings</span>
              </div>
              <div className="success-item">
                <LeafIcon size={20} />
                <span>4.5 tons CO₂ reduced annually</span>
              </div>
              <div className="success-item">
                <LightningIcon size={20} />
                <span>6-8 year payback period</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer-enhanced">
        <div className="footer-content-enhanced">
          <div className="footer-main">
            <div className="footer-brand-enhanced">
              <div className="logo-enhanced">
                <div className="logo-icon">
                  <SunIcon size={32} />
                </div>
                <span>BEDA SOLAR</span>
              </div>
              <p>Australia's most trusted solar calculator. Helping families transition to clean energy with confidence.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">Facebook</a>
                <a href="#" aria-label="Twitter">Twitter</a>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
                <a href="#" aria-label="Instagram">Instagram</a>
              </div>
            </div>

            <div className="footer-links-enhanced">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#testimonials">Reviews</a>
                <a href="#">Pricing</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Contact</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">ACCC Compliance</a>
              </div>
              <div className="link-group">
                <h4>Resources</h4>
                <a href="#">Solar Guide</a>
                <a href="#">Calculator</a>
                <a href="#">Blog</a>
                <a href="#">API</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-enhanced">
            <p>&copy; 2024 BEDA Solar. All rights reserved. Making Australia's clean energy future accessible to everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 