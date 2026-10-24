export type Project={id:string;name:string;category:string;description:string;href?:string;art:string;position:[number,number,number];rotation:[number,number,number]};
export const projects:Project[]=[
{id:'kos',name:'KasperskyOS for Mobile',category:'Product Design / Design Leadership',description:'Проектирование интерфейсов мобильной операционной системы и организация взаимодействия дизайна с разработкой.',href:'https://re-hash.github.io/Mypage/',art:'kos',position:[-3.4,.85,-.1],rotation:[0,.16,-.035]},
{id:'juicy',name:'Juicy Pairs',category:'Mobile App / Product Design',description:'Игровое дейтинг-приложение.',art:'juicy',position:[3.35,1.25,-1.1],rotation:[0,-.2,.035]},
{id:'sound',name:'UI Sound Design',category:'Interaction Design / Sound',description:'Звуки взаимодействия с мобильной системой.',art:'sound',position:[-3.1,-1.65,.15],rotation:[0,.13,.025]},
{id:'more',name:'More Projects',category:'Selected Work',description:'Другие работы — скоро.',art:'more',position:[3.35,-1.2,-.65],rotation:[0,-.17,-.035]}];
