from tethys_sdk.base import TethysAppBase, url_map_maker
from tethys_sdk.app_settings import CustomSetting


class HydroviewerHiwat(TethysAppBase):
    """
    Tethys app class for Hydroviewer Hiwat.
    """

    name = 'Hydroviewer Hiwat'
    index = 'hydroviewer_hiwat:home'
    icon = 'hydroviewer_hiwat/images/Bangladesh_Hiwat_Hidroviewer_Logo.png'
    package = 'hydroviewer_hiwat'
    root_url = 'hydroviewer-hiwat'
    color = '#c0392b'
    description = 'Place a brief description of your app here.'
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='hydroviewer-hiwat',
                controller='hydroviewer_hiwat.controllers.home'
            ),
            UrlMap(
                name='get_hiwat',
                url='hydroviewer-hiwat/get-hiwat',
                controller='hydroviewer_hiwat.controllers.get_hiwat'
            ),
            UrlMap(
                name='get_historic',
                url='hydroviewer-hiwat/get-historic',
                controller='hydroviewer_hiwat.controllers.get_historic'
            ),
            UrlMap(
                name='get_hiwat',
                url='hydroviewer-hiwat/download-hiwat',
                controller='hydroviewer_hiwat.controllers.download_hiwat'
            ),
            UrlMap(
                name='get_historic',
                url='hydroviewer-hiwat/download-historic',
                controller='hydroviewer_hiwat.controllers.download_historic'
            ),
            UrlMap(
                name='get-available-dates',
                url='hydroviewer-hiwat/get-available-dates',
                controller='hydroviewer_hiwat.controllers.get_avaialable_dates_raw'
            ),
            UrlMap(
                name='get-return-periods',
                url='hydroviewer-hiwat/get-return-periods',
                controller='hydroviewer_hiwat.controllers.get_return_periods_final'
            ))

        return url_maps

    def custom_settings(self):
        return (

            CustomSetting(
                name='forescast_data',
                type=CustomSetting.TYPE_STRING,
                description='Path to local HIWAT-RAPID forecast directory',
                required=True
            ),
            CustomSetting(
                name='historical_data',
                type=CustomSetting.TYPE_STRING,
                description='Path to local HIWAT-RAPID historical directory',
                required=True
            ),
            CustomSetting(
                name='return_periods',
                type=CustomSetting.TYPE_STRING,
                description='Path to local HIWAT-RAPID historical return periods directory',
                required=True
            ),
        )


