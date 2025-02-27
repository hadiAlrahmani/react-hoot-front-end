import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as hootService from '../../services/hootService';

// CREATE A ROUTE THEN SERVICE THEN COMPONENTS

const HootDetails = (props) => {

const [hoot, setHoot] = useState(null);

const { hootId } = useParams();
console.log('hootId', hootId);

useEffect(() => {
    const fetchHoot = async () => {
      const hootData = await hootService.show(hootId);
      console.log('hootData', hootData);
      setHoot(hootData);
    };
    fetchHoot();
  }, [hootId]);

  console.log('hoot state:', hoot);
  
if (!hoot) return <main>Loading...</main>;


return (
    <main>
      <header>
        <p>{hoot.category.toUpperCase()}</p>
        <h1>{hoot.title}</h1>
        <p>
          {hoot.author.username} posted on
          {new Date(hoot.createdAt).toLocaleDateString()}
        </p>
      </header>
      <p>{hoot.text}</p>
      <section>
        <h2>Comments</h2>
      </section>
    </main>
  );
  
    
  };
  

  
  export default HootDetails;

  