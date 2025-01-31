
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './component/Header';
import { Image } from './component/Image';
import { NumeredQuestion, Question } from './providers/QuestionProvider';
import { Quiz } from './quiz/Quiz';
import { ConfigScreen } from './screen/ConfigScreen';
import { ResultsScreen } from './screen/ResultsScreen';


const quiz = new Quiz();


function App() {

    const [question, setQuestion] = useState<NumeredQuestion | undefined>();
    const [autoMode, setAutoMode] = useState<boolean>(false);
    const timer = useRef<NodeJS.Timeout>();

    /**
     * Para esta app, como solo nos importa en el momento de contestar si está bien o mal, no hace falta recordar el pasado. Con esto alcanza y sobra...
     */
    const [answer, setAnswer] = useState<number>(-1);

    const setMyAnswer = (optionIndex: number) => {

        if (answer < 0) {
            quiz.answer(optionIndex);
            setAnswer(optionIndex);
        }

        if( autoMode )
        {
            clearInterval( timer.current ); 
            timer.current = setTimeout( next, 500 );
        }
    }

    const next = () => {

        clearInterval( timer.current ); 
        setAnswer(-1);
        setQuestion(quiz.getQuestion())
    }

    const restart = () => {

        clearInterval( timer.current ); 
        quiz.restart();
        setQuestion(undefined);
        setAnswer(-3);
    }



    return (
        <div className="App">
            <Header />

            {!question && !quiz.termino() && <ConfigScreen quiz={quiz} start={(auto) => { setAutoMode(auto) ; setQuestion(quiz.getQuestion()) }} />}

            {!question && quiz.termino() && <ResultsScreen quiz={quiz} restart={restart} />}

            {question &&
                <div className='question'>
                    <div className='pager'>
                        <strong>{question.number}</strong> / {quiz.limit}
                        <div style={{ fontSize: "0.3em" }}><strong>{quiz.limit}</strong> preguntas aleatorias de <strong>{quiz.totalAvailableQuestions()}</strong> barajadas.</div>
                    </div>

                    {question.image && <Image src={question.image} />}

                    <strong>{question.text}</strong>
                </div>
            }

            {question?.options.map((option, i) => <div key={i} className={`option ${answer > -1 ? question.correctIndex == i ? "isCorrect" : answer == i ? "isIncorrect" : "" : ""}`} onClick={() => setMyAnswer(i)}>{option}</div>)}

            {answer > -1 && <div className='next-question'>
                <a href="#" onClick={next}><strong>Siguiente →</strong></a>
            </div>}

            {question && <div className='next-question' style={{ fontSize: "1em" }}>
                <a href="#" onClick={restart}>↻ Reiniciar</a>
            </div>}

            <div style={{ marginTop: "50px", color: "#666", fontSize: "0.8em" }}>
                Algún error? <a href="https://github.com/bandinopla/simulador-test-de-conducir/issues" target="_blank">Posteá un issue / Avisanos</a>
                &nbsp;|&nbsp;Lee el <a href="https://www.buenosaires.gob.ar/sites/gcaba/files/manual_2022_compressed.pdf" target="_blank">Manual Teórico</a>
            </div>

            <div style={{ color: "#666", fontSize: "0.8em" }}>
                Fuente de los datos: {quiz.sourceLinks.map((source, i) => <a key={i} href={source.link} target="_blank" className="sourceLink">{source.name}</a>)}
            </div>

        </div>
    );
}


export default App;
