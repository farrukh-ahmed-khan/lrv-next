import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="footer-wrapper">
        <div className="container">
          {/* <div className="row">
            <div className="col-lg-1"></div>
            <div className="col-lg-10">
              <div className="subscribe-form">
                <h3>Subscribe to our newsletter</h3>
                <form>
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit">
                    <i className="fa fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
            <div className="col-lg-1"></div>
          </div> */}

          <div className="row">
            <div className="col-lg-3">
              {/* <div className="footer-logo-wrapper">
                <img src={logoft} alt="logo" />
              </div> */}
              <div className="footer-logo-text">
                <h3>About Los Ranchos Verdes</h3>
                <p>
                  Los Ranchos Verdes is a small community in Rolling Hills
                  Estates, California.
                </p>
              </div>
              <div className="footer-bottom-img">
                <div className="footersocial-icons">
                  <ul>
                    <li>
                      <a href="https://www.facebook.com/">
                        <i className="fa fa-facebook-official"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://x.com/">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com/">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footerLinks">
                <h3>Quick Links</h3>
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/books">Services</Link>
                  </li>
                  <li>
                    <Link href="/services">What We Do For You</Link>
                  </li>
                  <li>
                    <Link href="/lrvboard">Lrv Board</Link>
                  </li>
                  <li>
                    <Link href="/community">Community</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footerLinks">
                <h3>Useful links</h3>
                <ul>
                  <li>
                    <Link href="/dues">Pat my LRVHOA Dues</Link>
                  </li>
                  <li>
                    <Link href="/vote-candidate">Board Member Voting</Link>
                  </li>
                  <li>
                    <Link href="/phonedirectory">Directory</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="footerLinks">
                <h3>Los Ranchos Verdes Border Map</h3>
                <div className="map-wrap">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.564013640301!2d-0.12205847310047385!3d51.50286776103403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2slastminute.com%20London%20Eye!5e0!3m2!1sen!2sus!4v1743102809311!5m2!1sen!2sus"
                    width="100%"
                    height="200px"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-wrapper">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-lg-4"></div>
            <div className="col-lg-4">
              <div className="footer-bottom-content">
                <p>© 2025 Docu Loss. All Rights Reserved.</p>
              </div>
            </div>
            <div className="col-lg-4">
              {/* <div className="footer-bottom-content">
                <div className="bottom-link">
                  <ul>
                    <li>
                      <Link to="/privacy-policy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/terms-of-service">Terms of Service</Link>
                    </li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
