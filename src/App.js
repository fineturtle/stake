import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-responsive-modal/styles.css';
import './App.css';
import './style.css';
import Home from './pages';
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <>
            <Home />
            <ToastContainer />
        </>

    );
}

export default App;