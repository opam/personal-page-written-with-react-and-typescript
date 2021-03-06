import * as React from 'react';
import './results.css';
import './results_mobile.css';
import {isDesktop} from '../../utils/BrowserUtils';
import SearchBar from '../../components/searchBar/searchBar';
import Logo from '../../components/logo/logo';
import Result from '../../components/result/result';
import Detail from '../../components/detail/detail';
import {INavigation} from '../../texts/navigations';
import Images from '../../helper/images';
import Contact from '../../components/contact/contact';
import * as AddressBarUtils from '../../utils/AddressBarUtils';
import state from "../../state";
import IResult from "../../interfaces/IResult";

export default function Results() {

    const search = state.useSearch();
    const navigations = state.useNavigations();
    const intro = state.useIntro();
    const workExperience = state.useWorkExperience();
    const education = state.useEducation();
    const skills = state.useSkills();

    const [activeResult, setActiveResult] = React.useState<IResult | null>(null);

    React.useEffect(() => {
        new Images().preloadImages();
        navigateToResult();
    }, []);

    useOnResize(() => addScrollClassOnMobile(activeResult != null));

    function setValueIntoAddressBar(name) {
        AddressBarUtils.setSection(name);
    }

    function createLinks() {
        return navigations.map((link: INavigation, index: number) => {
            const priority = link.priority ? 'priority-' + link.priority : 'priority-high';
            const className = index === 0 ? priority + ' active' : priority; // only first can be active, other are external links

            return (
                <a
                    key={link.name}
                    href={link.url}
                    title={link.title}
                    className={className}
                    target={index === 0 ? "" : "_blank"}
                >
                    {link.name}
                </a>
            );
        });
    }

    const getNextResult = () => {
        const current = getCurrentResultNameFromAddressBar();
        switch (current) {
            case intro.getName():
                return workExperience.getName();
            case workExperience.getName():
                return education.getName();
            case education.getName():
                return skills.getName();
            case skills.getName():
                return null;
            default:
                return intro.getName();
        }
    };

    function navigateToNextResult() {
        const next = getNextResult();
        if (next == null) {
            setActiveResult(null);
        } else {
            navigateToResult(next);
        }
    }

    function navigateToResult(name?: string) {

        const takenFromHash = name === undefined;
        if (takenFromHash) {
            name = location.hash;
        }
        if (intro === undefined) {
            return; // in this case we came here for the first time from home!
        } else {
            const strippedName = getCurrentResultNameFromAddressBar(name);

            let result;

            switch (strippedName) {
                case intro.getName():
                    result = intro;
                    break;
                case workExperience.getName():
                    result = workExperience;
                    break;
                case education.getName():
                    result = education;
                    break;
                case skills.getName():
                    result = skills;
                    break;
                default:
                    result = intro;
                    name = intro.getName();
                    break;
            }

            setActiveResult(result);

            if (takenFromHash === false) {
                setValueIntoAddressBar(name);
            }
        }
    }

    function createMyLife() {
        return (
            <div>
                <Result
                    result={intro}
                    isActive={!!activeResult && activeResult.getName() === intro.getName()}
                    onClick={() => navigateToResult(intro.getName())}
                    onActiveClassName="blightblue"
                />
                <Result
                    result={workExperience}
                    isActive={!!activeResult && activeResult.getName() === workExperience.getName()}
                    onClick={() => navigateToResult(workExperience.getName())}
                    onActiveClassName="blightred"
                />
                <Result
                    result={education}
                    isActive={!!activeResult && activeResult.getName() === education.getName()}
                    onClick={() => navigateToResult(education.getName())}
                    onActiveClassName="blightyellow"
                />
                <Result
                    result={skills}
                    isActive={!!activeResult && activeResult.getName() === skills.getName()}
                    onClick={() => navigateToResult(skills.getName())}
                    onActiveClassName="blightblue"
                />
            </div>
        );
    }

    return (
        <div className="results">
            <div className="header">
                <div className="left" onClick={() => search.setIsAnimated(false)}>
                    <Logo game={false}/>
                </div>
                <div className="right">
                    <SearchBar message={search.getMessage()} animate={false}/>
                    <div className="links">{createLinks()}</div>
                </div>
            </div>
            <div className="body">
                <div className="left">
                    <div className="info"><br/></div>
                    {createMyLife()}
                    <Contact/>
                </div>
                <div className="right">
                    {activeResult != null && <Detail
                        result={activeResult}
                        isActive={activeResult != null}
                        setNotActiveDetail={() => setActiveResult(null)}
                        onNextClick={navigateToNextResult}
                    />}
                </div>
                <div className="clear"/>
            </div>
        </div>
    );
}

function addScrollClassOnMobile(isSomeActionActive: boolean) {
    if (isSomeActionActive && isDesktop() === false) {
        document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
    }
}

function getCurrentResultNameFromAddressBar(strippedName = location.hash) {
    if (strippedName.indexOf('#') > -1) {
        strippedName = strippedName.replace('#', '');
        strippedName = (strippedName.split(":_"))[0];
    }
    return strippedName;
}

function useOnResize(cb: () => void) {
    React.useEffect(() => {
        cb();
        window.addEventListener('resize', cb);
        return () => window.removeEventListener('resize', cb);
    }, []);
}