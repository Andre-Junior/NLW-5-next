import { GetStaticProps } from 'next';
import { api } from '../services/api';

//tipagem Types
type Episode = Array <{
    id: string;
    title: string;
    members: string;
}> //precisa passar qual o formato de oq é 


type HomeProps = {
  episodes: Episode[]; //outra forma de declarar array
}



export default function Home(props: HomeProps) {
  return (
    <h1>Index</h1> 
  )
}


//Next 
export const getStaticProps: GetStaticProps = async () =>  {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publisched_at',
      _order: 'desc'
    }
  }) //por causa da ferramenta axios coloca o http://localhost como base saindo ele daqui

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
} 