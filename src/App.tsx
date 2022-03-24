import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components/macro";

function App() {
  const [imageURL, setImageURL] = useState("");
  const [matrix, setMatrix] = useState<
    {
      r: number;
      g: number;
      b: number;
      a: number;
    }[][]
  >();

  const urlAPI = "http://localhost:4000";

  const fetchArray = async (imageURL: string) => {
    axios.post(urlAPI, { imageURL }).then((response) => {
      if (response?.data?.matrix) {
        setMatrix(response.data.matrix);
      }
    });
  };

  useEffect(() => {
    console.log(matrix);
  }, [matrix]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setImageURL(value);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!e.target.value) {
      setMatrix(undefined);
    }
    try {
      setMatrix(JSON.parse(e.target.value));
    } catch (error) {}
  };

  return (
    <AppContainer className="App">
      <h1>Hello World</h1>
      <input onChange={handleInputChange}></input>
      <ProcessButton
        onClick={() => {
          fetchArray(imageURL);
        }}
      >
        Process
      </ProcessButton>
      {!!matrix && (
        <LedMatrix>
          {matrix.map((row, i) => {
            return (
              <Row key={i}>
                {row.map((col, j) => {
                  return (
                    <LED key={`${i}-${j}`} pitch={3}>
                      <Pixel
                        r={col.r}
                        g={col.g}
                        b={col.b}
                        a={col.a}
                        pitch={3}
                      ></Pixel>
                    </LED>
                  );
                })}
              </Row>
            );
          })}
        </LedMatrix>
      )}
      <StyledTextArea
        cols={100}
        rows={20}
        value={JSON.stringify(matrix, null, 2)}
        onChange={handleTextAreaChange}
      ></StyledTextArea>
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const StyledTextArea = styled.textarea``;

const LedMatrix = styled.div``;

const Row = styled.div`
  display: flex;
`;

const LED = styled.div<{ pitch: number }>`
  background-color: black;
  height: calc(4px * ${({ pitch }) => pitch});
  width: calc(4px * ${({ pitch }) => pitch});
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Pixel = styled.div.attrs<{
  r: number;
  g: number;
  b: number;
  a: number;
  pitch: number;
}>((props) => ({
  style: {
    backgroundColor: `rgba(${props.r}, ${props.g}, ${props.b}, ${props.a}`,
  },
}))<{
  r: number;
  g: number;
  b: number;
  a: number;
  pitch: number;
}>`
  border-radius: ${({ pitch }) => pitch / 2}px;
  height: ${({ pitch }) => pitch * 3}px;
  width: ${({ pitch }) => pitch * 3}px;
`;

const ProcessButton = styled.button``;
