import React from 'react';
import '../styles/LoginPage.css';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignIn: true,
    };
  }

  toggleSignInSignUp = () => {
    this.setState((prevState) => ({
      isSignIn: !prevState.isSignIn,
    }));
  };

  render() {
    const { isSignIn } = this.state;

    return (
      <div className={`container ${isSignIn ? '' : 'sign-up-mode'}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form className="sign-in-form">
              <h2>Sign in to Skills Realistic</h2>
              <div className="social-icons">
                <button type="button" className="social-btn">
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </button>
                <button type="button" className="social-btn">
                  <img src="/icons/google.svg" alt="Google" />
                </button>
              </div>
              <p className="divider">or use your email account:</p>
              <div className="input-field">
                <img src="/icons/email.svg" alt="" className="input-icon" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <img src="/icons/lock.svg" alt="" className="input-icon" />
                <input type="password" placeholder="Password" />
              </div>
              <a href="#" className="forgot-password">Forgot your password?</a>
              <button type="submit" className="btn">SIGN IN</button>
            </form>

            {/* Sign Up Form */}
            <form className="sign-up-form">
              <h2>Create Account</h2>
              <div className="social-icons">
                <button type="button" className="social-btn">
                  <img src="/icons/facebook.svg" alt="Facebook" />
                </button>
                <button type="button" className="social-btn">
                  <img src="/icons/google.svg" alt="Google" />
                </button>
              </div>
              <p className="divider">or use your email for registration:</p>
              <div className="input-field">
                <img src="/icons/user.svg" alt="" className="input-icon" />
                <input type="text" placeholder="Name" />
              </div>
              <div className="input-field">
                <img src="/icons/email.svg" alt="" className="input-icon" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-field">
                <img src="/icons/lock.svg" alt="" className="input-icon" />
                <input type="password" placeholder="Password" />
              </div>
              <button type="submit" className="btn">SIGN UP</button>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Sign up and discover more with us!</p>
              <button className="btn transparent" onClick={this.toggleSignInSignUp}>SIGN UP</button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>If you already have an account, sign in here.</p>
              <button className="btn transparent" onClick={this.toggleSignInSignUp}>SIGN IN</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
