import Person from '../assets/Alone.png';
import Group from '../assets/Group.png';
import Arrow from '../assets/Blue_Arrow.png';
import '../css/Home.css';

function Home(){
    return (
        <div className='home-container'>
            <img src={Person} alt="Person" className='alone'/>
            <div className='image-text-container'>
                <img src={Arrow} alt="Blue Arrow" className='arrow'/>
                <img src={Group} alt="Group" className='group'/>
            </div>
        </div>
    );
}

export default Home;