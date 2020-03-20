export const SearchTrackConfig = () => {
    return ({
        height: 4.5,
        heightUnit: 'em',
        isPlayable: true,
        canQueue: true,
        canRemoveQueue: false
    })
}

export const CurrentTrackConfig = () => {
    return ({
        height: 6,
        heightUnit: 'em',
        isPlayable: false,
        canQueue: false,
        canRemoveQueue: false
    })
}

export const QueueTrackConfig = () => {
    return ({
        height: 3,
        heightUnit: 'em',
        isPlayable: false,
        canQueue: false,
        canRemoveQueue: true
    })
}