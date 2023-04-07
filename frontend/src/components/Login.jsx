import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"
import shareVideo from "../assets/share.mp4"
import logo from "../assets/logowhite.png"
import jwt_decode from "jwt-decode"
import { client } from "../client"

const Login = () => {
  const navigate = useNavigate()

  const responseGoogle = (credentialResponse) => {
    const { credential } = credentialResponse
    const res = jwt_decode(credential)

    localStorage.setItem("user", JSON.stringify(res))
    const { name, picture, sub } = res

    const doc = {
      _id: sub,
      _type: "user",
      userName: name,
      image: picture,
    }

    client
      .createIfNotExists(doc)
      .then(() => {
        return navigate("/", { replace: true })
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
            >
              <GoogleLogin
                auto_select={false}
                onSuccess={responseGoogle}
                onError={() => {
                  console.log("Login Failed")
                }}
              />
              ;
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
