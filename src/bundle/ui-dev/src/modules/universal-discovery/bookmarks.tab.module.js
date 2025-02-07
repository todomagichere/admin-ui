import React, { useContext, useState, useEffect, useRef } from 'react';

import Tab from './components/tab/tab';
import BookmarksList from './components/bookmarks-list/bookmarks.list';
import GridView from './components/grid-view/grid.view';
import Finder from './components/finder/finder';
import TreeView from './components/tree-view/tree.view';

import {
    CurrentViewContext,
    MarkedLocationIdContext,
    RestInfoContext,
    LoadedLocationsMapContext,
    SortingContext,
    SortOrderContext,
    RootLocationIdContext,
    TabsConfigContext,
} from './universal.discovery.module';
import { loadAccordionData } from './services/universal.discovery.service';

const { Translator, ibexa } = window;

const BookmarksTabModule = () => {
    const shouldRestorePreviousStateRef = useRef(true);
    const restInfo = useContext(RestInfoContext);
    const tabsConfig = useContext(TabsConfigContext);
    const [currentView] = useContext(CurrentViewContext);
    const [markedLocationId, setMarkedLocationId] = useContext(MarkedLocationIdContext);
    const [sorting] = useContext(SortingContext);
    const [sortOrder] = useContext(SortOrderContext);
    const rootLocationId = useContext(RootLocationIdContext);
    const [loadedLocationsMap, dispatchLoadedLocationsAction] = useContext(LoadedLocationsMapContext);
    const [bookmarkedLocationMarked, setBookmarkedLocationMarked] = useState(null);
    const views = {
        grid: <GridView itemsPerPage={tabsConfig.bookmarks.itemsPerPage} />,
        finder: <Finder itemsPerPage={tabsConfig.bookmarks.itemsPerPage} />,
        tree: <TreeView itemsPerPage={tabsConfig.bookmarks.itemsPerPage} />,
    };
    const renderBrowseLocations = () => {
        if (!markedLocationId) {
            return null;
        }

        return views[currentView];
    };

    useEffect(() => {
        setMarkedLocationId(null);
        dispatchLoadedLocationsAction({ type: 'CLEAR_LOCATIONS' });

        return () => {
            if (shouldRestorePreviousStateRef.current) {
                setMarkedLocationId(markedLocationId);
                dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: loadedLocationsMap });
            }
        };
    }, []);

    useEffect(() => {
        if (!bookmarkedLocationMarked) {
            return;
        }

        shouldRestorePreviousStateRef.current = false;
        setMarkedLocationId(bookmarkedLocationMarked);
        loadAccordionData(
            {
                ...restInfo,
                parentLocationId: bookmarkedLocationMarked,
                sortClause: sorting,
                sortOrder: sortOrder,
                gridView: currentView === 'grid',
                rootLocationId,
            },
            (locationsMap) => {
                dispatchLoadedLocationsAction({ type: 'SET_LOCATIONS', data: locationsMap });
            },
        );
    }, [bookmarkedLocationMarked, currentView, restInfo, dispatchLoadedLocationsAction, setMarkedLocationId]);

    useEffect(() => {
        if (markedLocationId !== bookmarkedLocationMarked) {
            dispatchLoadedLocationsAction({ type: 'CUT_LOCATIONS', locationId: markedLocationId });
            setBookmarkedLocationMarked(null);
        }
    }, [markedLocationId, setBookmarkedLocationMarked, bookmarkedLocationMarked, dispatchLoadedLocationsAction]);

    return (
        <div className="m-bookmarks-tab">
            <Tab>
                <BookmarksList itemsPerPage={tabsConfig.bookmarks.itemsPerPage} setBookmarkedLocationMarked={setBookmarkedLocationMarked} />
                {renderBrowseLocations()}
            </Tab>
        </div>
    );
};

ibexa.addConfig(
    'adminUiConfig.universalDiscoveryWidget.tabs',
    [
        {
            id: 'bookmarks',
            component: BookmarksTabModule,
            label: Translator.trans(/*@Desc("Bookmarks")*/ 'bookmarks.label', {}, 'universal_discovery_widget'),
            icon: ibexa.helpers.icon.getIconPath('bookmark'),
        },
    ],
    true,
);

export default BookmarksTabModule;
