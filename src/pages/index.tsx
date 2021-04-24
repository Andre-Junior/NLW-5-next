import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

//tipagem Types
type Episode = Array <{
    id: string;
    title: string;
    members: string;
    published_at: string;
}> //precisa passar qual o formato de oq é 


type HomeProps = {
  episodes: Episode[]; //outra forma de declarar array
}



export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Index</h1> 
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
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
  }) //por causa da ferramenta axios coloca o http://localhost como base saindo ele daqui e aparecendo os params

  //formatação dos dados

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}), //Formatação através do date-fns
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,

    }
  })


  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
} 