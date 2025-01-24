import { styled } from "styled-components";
import { BREAKPOINT_TABLET, GAMMELROSA, KOLSVART, KRITVIT, SKUGGLILA } from "../components/styled/Variables";
import { ResultWrapper, TextStyle } from "../components/Wrappers";
import { H2Title } from "../components/styled/Fonts";
import { ResultBackButton } from "../components/styled/Buttons";
import { Link } from "react-router-dom";


export const ScoreGrid = styled.div`
  background-color: ${KRITVIT};
  border-radius: 10px;
  color: ${KOLSVART};
  width: 100%;
  max-width: 300px;
  padding: 20px;
  display: grid;
  grid-template-rows: auto;
  border: 1px solid black;
  padding-bottom: 150px;

  @media screen and (min-width: ${BREAKPOINT_TABLET}) {
    max-width: 400px;
  }
`;

export const ResultTitle = styled.div`
  font-weight: bold;
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr;
  margin-bottom: 5px;
  padding-left: 10px;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: ${BREAKPOINT_TABLET}) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

export const ResultItem = styled.div<{ index: number; isFirst: boolean; isLast: boolean }>`
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr;
  row-gap: 10px;
  padding: 10px 0;
  background-color: ${({ index }) => (index % 2 === 0 ? `${GAMMELROSA}` : `${SKUGGLILA}`)};
  color: ${KRITVIT};
  font-weight: 600;
  padding-left: 10px;

  border-radius: ${({ isFirst, isLast }) =>
    isFirst ? "10px 10px 0 0" : isLast ? "0 0 10px 10px" : "0"};
  border-left: 1px solid ${SKUGGLILA};
  border-right: 1px solid ${SKUGGLILA};
  border-top: ${({ isFirst }) => (isFirst ? `1px solid ${SKUGGLILA}` : "none")};
  border-bottom: ${({ isLast }) => (isLast ? `1px solid ${SKUGGLILA}` : "none")};

  @media screen and (min-width: ${BREAKPOINT_TABLET}) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

export const ResultRabbit = styled.img`
  width: 20px;
  align-items: center;
  justify-content: center;
`;

export const Spelregler = () => {

  return (
    <ResultWrapper>
      <H2Title>Spelregler</H2Title>
        <TextStyle>
          Lös mattetalet och välj kortet med rätt svar för att hitta en
          kanin! En kanin ger 1 poäng. För 5 kaniner får du en guldkanin,
          som ger 2 poäng extra. Du har 2 minuter på dig.
        </TextStyle>


      <Link to={"/"}>
        <ResultBackButton>Tillbaka</ResultBackButton>
      </Link>

    </ResultWrapper>
  );  
};