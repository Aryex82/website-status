import { FC, ReactNode, Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '@/components/footer';
import styles from '@/components/Layout/Layout.module.scss';
import NavBar from '@/components/navBar';
import { navBarContentMock, featureFlags } from '@/constants/navbar-Content';
import { useGetUserQuery } from '@/app/services/userApi';
import { Loader } from '../tasks/card/Loader';

interface Props {
    children?: ReactNode;
}

const navBarContent = (title: string, refUrl: string, isActive = false) => {
    const linkClasses = `${styles.link} ${isActive ? styles.active : ''}`;

    return (
        <Link href={refUrl} passHref>
            <button type="button" tabIndex={0} className={linkClasses}>
                {title}
            </button>
        </Link>
    );
};

const Layout: FC<Props> = ({ children }) => {
    const router = useRouter();
    const { isLoading } = useGetUserQuery();

    // Dev feature toggle
    const { query } = router;
    const dev = !!query.dev;

    return (
        <div className={styles.layout}>
            <NavBar />
            {isLoading && <Loader />}
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    {navBarContentMock.map((element, index) => (
                        <Fragment key={index}>
                            {navBarContent(
                                element.title,
                                element.refURL,
                                router.pathname === element.pathName
                            )}
                            {element.pipeSymbol}
                        </Fragment>
                    ))}
                    {dev && (
                        <>
                            {featureFlags.map((element, index) => {
                                return (
                                    <>
                                        {element.pipeSymbol}
                                        <Fragment key={index}>
                                            {navBarContent(
                                                element.title,
                                                element.refURL,
                                                router.pathname ===
                                                    element.pathName
                                            )}
                                        </Fragment>
                                    </>
                                );
                            })}
                        </>
                    )}
                </div>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
