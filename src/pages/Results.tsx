import { useState, useEffect } from "react";
import { getUserSession } from "../services/CookieService";
import { styled } from "styled-components";
import { BREAKPOINT_TABLET, GAMMELROSA, KOLSVART, KRITVIT, SKUGGLILA } from "../components/styled/Variables";
import { ResultWrapper, TextStyleCentered } from "../components/Wrappers";
import { H2Title } from "../components/styled/Fonts";
import { ButtonArrowLeft, ButtonArrowRight, ResultBackButton } from "../components/styled/Buttons";
import { Link } from "react-router-dom";
import { SortDropdown } from "../components/SortDropdown";
import { PawSpinner } from "../components/PawSpinner";
import RabbitYellow from "../assets/img/rabbits/rabbit_shadow_yellow.png";
import { format } from 'date-fns';

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

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  gap: 50px;
`;


interface GameResult {
  total_score: number;
  game_date: string;
  golden_rabbits: number;
}

export const Results = () => {
  const [, setGameResults] = useState<GameResult[]>([]);
  const [sortedResults, setSortedResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const resultsPerPage = 5;
  const totalPages = Math.ceil(sortedResults.length / resultsPerPage);

  useEffect(() => {
    const fetchResults = async () => {
      const session = getUserSession();

      if (session && session.user_id && session.token) {
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        try {
          const resultsResponse = await fetch(
            `${API_URL}/game_results/${session.user_id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );

          const resultsData = await resultsResponse.json();

          if (resultsResponse.ok) {
            setGameResults(resultsData.results);
            sortResults(resultsData.results, sortBy);
          } else {
            console.error("Error fetching game results:", resultsData);
          }
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Användarsession saknas eller är ogiltig.");
        setLoading(false);
      }
    };

    fetchResults();
  }, [sortBy]);

  const sortResults = (results: GameResult[], sortBy: string) => {
    const sorted = [...results];
    switch (sortBy) {
      case "highestScore":
        sorted.sort((a, b) => b.total_score - a.total_score);
        break;
      case "lowestScore":
        sorted.sort((a, b) => a.total_score - b.total_score);
        break;
      case "mostGoldenRabbits":
        sorted.sort((a, b) => b.golden_rabbits - a.golden_rabbits);
        break;
      case "latest":
        sorted.sort(
          (a, b) =>
            new Date(b.game_date).getTime() - new Date(a.game_date).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.game_date).getTime() - new Date(b.game_date).getTime()
        );
        break;
      default:
        break;
    }
    setSortedResults(sorted);
    setCurrentPage(1);
  };

  const currentResults = sortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <ResultWrapper>
      {loading ? (
        <PawSpinner />
      ) : (
        <ScoreGrid>
          <H2Title>Mina resultat</H2Title>
          {sortedResults.length > 0 && (
            <>
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
              <ResultTitle>
                <div>Datum</div>
                <div>Poäng</div>
                <ResultRabbit src={RabbitYellow} />
              </ResultTitle>
            </>
          )}

          {currentResults.length > 0 ? (
            currentResults.map((result, index) => {
              const formattedDate = format(new Date(result.game_date), 'dd MMMM yyyy');

              return (
                <ResultItem
                  key={index}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === currentResults.length - 1}
                >
                  <div>{formattedDate}</div>
                  <div>{result.total_score}</div>
                  <div>{result.golden_rabbits}</div>
                </ResultItem>
              );
            })
          ) : (
            <TextStyleCentered>Inga resultat funna.</TextStyleCentered>
          )}

          <PaginationControls>
            <ButtonArrowLeft
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1} />
            <ButtonArrowRight
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationControls>
        </ScoreGrid>
      )}
      <Link to={"/"}>
        <ResultBackButton>Tillbaka</ResultBackButton>
      </Link>
    </ResultWrapper>
  );
};
