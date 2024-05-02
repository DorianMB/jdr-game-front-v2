export interface CharacterModel {
    character_id: number,
    name: string,
    picture: string,
    experience: number,
    money: number,
    user_id: number,
    equipment_id: number,
    stat_id: number,
    bag_id: number,
    created_at: Date,
    updated_at: Date
}