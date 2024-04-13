
import './Game.css';
import './reset.css';
import { useState, useEffect } from 'react';

function Game() {
    const [state, setState] = useState(0);
    const [gameString, setGameString] = useState("");
    const [gameSettings, setGameSettings] = useState([]);

    // game status
    const [board, setBoard] = useState([]);
    const [boardMap, setBoardMap] = useState([]);
    const [revealed, setRevealed] = useState([]);

    function GameBoard() {

        return (
            <>
                <div className="MS_GameHolder">
                    {revealed.map((ele, index) => <GameRow colID={index} row={ele}/>)}
                </div>
            </>
        )
    }
    function GameRow(props) {
        return (
            <>
                <div className="MS_RowHolder">
                    <>
                        {props.row.length === 0 ? (
                            <>
                            </>
                        ) : (
                            <>
                                {props.row.map((ele, rowID) => <p onClick={(e) => revealSquare(props.colID, rowID)}className="MS_Board">{ele}</p>)}
                            </>
                        )}
                    </>
                </div>
            </>
            
        )
    }
    function readGameString() {
        let arr1 = gameString.split(",");
        let arr2 = [];
        for(let i = 0; i < arr1.length; i++) {
            arr2.push(parseInt(arr1[i]));
        }
        setGameSettings(arr2);
    }
    useEffect(() => {
        if (gameSettings.length !== 0) {
            console.log('building game board');
            buildGameBoard();
        }
    }, [gameSettings])

    function revealSquare(colID, rowID) {
        let reveals = [...revealed];
        reveals[colID][rowID] = boardMap[colID][rowID];
        if (reveals[colID][rowID] === 0) {
            checkAdjacentSquaresForZeros(colID, rowID);
        }
        setRevealed(reveals);
    }

    function revealSpecific(colID, rowID) {
        let reveals = [...revealed];
        reveals[colID][rowID] = boardMap[colID][rowID];
        // setRevealed(reveals);
    }

    function buildGameBoard() {
        let width = gameSettings[0];
        let height = gameSettings[1];
        let mineLocations = gameSettings.slice(2);
        let boardSize = width * height;

        let boardMap = [];
        for (let i = 0; i < boardSize; i++) {
            if (mineLocations.includes(i)) {
                boardMap.push("X");
            } else {
                boardMap.push("0");
            }
        }

        let arr2 = [];
        let boardMapRevealed = [];
        for (let i = 0; i < gameSettings[0]; i++) {
            let subArr = [];
            let subArrRevealed = [];
            for (let j = 0; j < gameSettings[1]; j++) {
                subArr.push(boardMap[j + (i * gameSettings[0])]);
                subArrRevealed.push("_");
            }
            arr2.push(subArr);
            boardMapRevealed.push(subArrRevealed);
        }
        setBoard(arr2);
        setRevealed(boardMapRevealed);
    }
    useEffect(() => {
        if (board.length !== 0 && revealed.length !== 0) {
            mapGameBoard();
        }
    }, [board, revealed])

    function mapGameBoard() {
        let arr1 = [];
        for (let i = 0; i < gameSettings[0]; i++) {
            let subArr = []
            for (let j = 0; j < gameSettings[1]; j++) {
                if (board[i][j] === "X") {
                    subArr.push("X");
                } else {
                    subArr.push(analyzeSquare(i, j));
                }
            }
            arr1.push(subArr);
        }
        // console.log("=====");
        // console.log(arr1);
        // console.log(board);
        setBoardMap(arr1);
        setState(1);
    }

    function checkAdjacentSquaresForZeros(xVal, yVal, stack = []) {
        let count = 0;
        let checks = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    checks.push([xVal + i, yVal + j]);
                } 
            }
        }
        for (let i = 0; i < checks.length; i++) {
            if (checks[i][0] >= 0 && checks[i][0] < gameSettings[0]) {
                if (checks[i][1] >= 0 && checks[i][1] < gameSettings[1]) {
                    // console.log("HIT 3!");
                    // console.log(board[checks[i][0]][checks[i][1]]);
                    // console.log(board[checks[i][0]][checks[i][1]] === "0");
                    if (boardMap[checks[i][0]][checks[i][1]] === 0) {
                        // console.log("HIT 2!");
                        if (revealed[checks[i][0]][checks[i][1]] !== "0") {
                            // console.log("HIT!");
                            let coord = [checks[i][0], checks[i][1]];
                            if (!stack.includes(coord.toString())) {
                                stack.push(coord.toString());
                                console.log(coord);
                                revealSpecific(coord[0], coord[1]);
                                checkAdjacentSquaresForZeros(coord[0], coord[1], stack);
                            }
                        }
                    }
                }
            }
        }
    }

    function analyzeSquare(xVal, yVal) {
        let count = 0;
        let checks = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!(i === 0 && j === 0)) {
                    checks.push([xVal + i, yVal + j]);
                } 
            }
        }

        for (let i = 0; i < checks.length; i++) {
            if (checks[i][0] >= 0 && checks[i][0] < gameSettings[0]) {
                if (checks[i][1] >= 0 && checks[i][1] < gameSettings[1]) {
                    if (board[checks[i][0]][checks[i][1]] === "X") {
                        count += 1;
                    }
                }
            }
        }
        return count;
    }

    function buildGame() {
        readGameString();
    }


    return (
        <div className="MS_Background">
            <p className="MS_Title">Minesweeper</p>
            {state === 0 ? (
                <>
                    <p className="MS_Label">Input Game String:</p>
                    <input className="MS_Input" onChange={(e) => setGameString(e.target.value)}></input>

                    <div className="MS_ButtonHolder">
                        <p onClick={(e) => buildGame()}className="MS_Button">Play</p>
                    </div>
                </>
            ) : (
                <>
                    <GameBoard />
                </>
            )}
        </div>
        
    )
}

export default Game;