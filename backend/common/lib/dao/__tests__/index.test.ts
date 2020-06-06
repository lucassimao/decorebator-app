import DaoIndex from '../index'

test('should export Database as well as the domain classes',()=>{
    expect(Object.keys(DaoIndex)).toHaveLength(6)
    expect(DaoIndex.Database).not.toBeNull
    expect(DaoIndex.Image).not.toBeNull
    expect(DaoIndex.User).not.toBeNull
    expect(DaoIndex.Word).not.toBeNull
    expect(DaoIndex.Wordlist).not.toBeNull
    expect(DaoIndex.YoutubeSubtitle).not.toBeNull
})